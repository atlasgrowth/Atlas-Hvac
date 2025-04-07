import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { parseCsvData } from "./utils/csvParser";
import { setupAuth } from "./auth";
import { insertPageVisitSchema, insertCompanySchema, insertServiceSchema, insertReviewSchema, insertVisitorSessionSchema } from "@shared/schema";
import { z } from "zod";

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// Administrator role middleware
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Admin privileges required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Skip loading CSV data on app startup to avoid potential startup issues
  // This data is already loaded in the database

  // Public API Routes
  
  // Get all public companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      // Filter out non-public companies for public API
      const publicCompanies = companies.filter(c => c.isPublic !== false);
      res.json(publicCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  // Get company by slug
  app.get("/api/companies/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const company = await storage.getCompanyBySlug(slug);
      
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      // If company is not public, only return if user is authenticated
      if (company.isPublic === false && !req.isAuthenticated()) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  // Get services for a company
  app.get("/api/companies/:slug/services", async (req, res) => {
    try {
      const { slug } = req.params;
      const company = await storage.getCompanyBySlug(slug);
      
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      const services = await storage.getServicesForCompany(company.id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Get reviews for a company
  app.get("/api/companies/:slug/reviews", async (req, res) => {
    try {
      const { slug } = req.params;
      const company = await storage.getCompanyBySlug(slug);
      
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      const reviews = await storage.getReviewsForCompany(company.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create a contact/message
  app.post("/api/companies/:slug/contact", async (req, res) => {
    try {
      const { slug } = req.params;
      const company = await storage.getCompanyBySlug(slug);
      
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      // In a real implementation, this would store the contact in a database
      // and potentially send an email or notification
      
      res.json({ success: true, message: "Contact message sent successfully" });
    } catch (error) {
      console.error("Error sending contact message:", error);
      res.status(500).json({ error: "Failed to send contact message" });
    }
  });

  // Record a page visit
  app.post("/api/analytics/page-visit", async (req, res) => {
    try {
      const visitData = insertPageVisitSchema.parse(req.body);
      const pageVisit = await storage.recordPageVisit(visitData);
      res.status(201).json(pageVisit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data format", details: error.errors });
      }
      console.error("Error recording page visit:", error);
      res.status(500).json({ error: "Failed to record page visit" });
    }
  });

  // Start a visitor session
  app.post("/api/analytics/session-start", async (req, res) => {
    try {
      const sessionData = insertVisitorSessionSchema.parse(req.body);
      const session = await storage.startVisitorSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data format", details: error.errors });
      }
      console.error("Error starting visitor session:", error);
      res.status(500).json({ error: "Failed to start visitor session" });
    }
  });

  // End a visitor session
  app.post("/api/analytics/session-end/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { duration } = req.body;
      
      if (typeof duration !== 'number') {
        return res.status(400).json({ error: "Duration must be a number" });
      }
      
      const session = await storage.endVisitorSession(parseInt(id), duration);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error ending visitor session:", error);
      res.status(500).json({ error: "Failed to end visitor session" });
    }
  });

  // =============== PROTECTED ADMIN API ROUTES ===============

  // Get all companies (including non-public)
  app.get("/api/admin/companies", isAuthenticated, async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  // Create a new company
  app.post("/api/admin/companies", isAuthenticated, async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data format", details: error.errors });
      }
      console.error("Error creating company:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  // Update a company
  app.put("/api/admin/companies/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const company = await storage.updateCompany(parseInt(id), req.body);
      
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Create a service for a company
  app.post("/api/admin/companies/:id/services", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        companyId: parseInt(id)
      });
      
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data format", details: error.errors });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  // Create a review for a company
  app.post("/api/admin/companies/:id/reviews", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        companyId: parseInt(id)
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data format", details: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Get analytics for a company
  app.get("/api/admin/companies/:id/analytics", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const pageVisits = await storage.getPageVisitsForCompany(parseInt(id));
      const sessions = await storage.getVisitorSessionsForCompany(parseInt(id));
      
      // Calculate some basic analytics
      const totalPageVisits = pageVisits.length;
      const totalSessions = sessions.length;
      
      // Calculate average session duration
      const completedSessions = sessions.filter(s => s.duration);
      const avgSessionDuration = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length 
        : 0;
      
      // Group visits by page
      const pageVisitCounts = pageVisits.reduce((acc, visit) => {
        const page = visit.page;
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({
        totalPageVisits,
        totalSessions,
        avgSessionDuration,
        pageVisitCounts,
        recentPageVisits: pageVisits.slice(0, 10),
        recentSessions: sessions.slice(0, 10)
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
