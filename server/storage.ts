import { 
  users, 
  companies, 
  services, 
  reviews, 
  pageVisits,
  visitorSessions,
  type User, 
  type InsertUser, 
  type Company, 
  type InsertCompany, 
  type Service, 
  type InsertService, 
  type Review, 
  type InsertReview,
  type PageVisit,
  type InsertPageVisit,
  type VisitorSession,
  type InsertVisitorSession
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { db, client } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company methods
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyBySlug(slug: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined>;
  
  // Service methods
  getServicesForCompany(companyId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Review methods
  getReviewsForCompany(companyId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Page visit methods
  recordPageVisit(visit: InsertPageVisit): Promise<PageVisit>;
  getPageVisitsForCompany(companyId: number, limit?: number): Promise<PageVisit[]>;
  
  // Visitor session methods
  startVisitorSession(session: InsertVisitorSession): Promise<VisitorSession>;
  endVisitorSession(id: number, duration: number): Promise<VisitorSession | undefined>;
  getVisitorSessionsForCompany(companyId: number, limit?: number): Promise<VisitorSession[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Setup session store with PostgreSQL
    // Using simplified configuration to avoid startup issues
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // If slug is not provided in a name, generate one from the name
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Company methods
  async getAllCompanies(): Promise<Company[]> {
    // Note: This is a simplified implementation until the database is migrated
    // with the new leadStatus and pipelineStage columns
    const results = await db.select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      nameForEmails: companies.nameForEmails,
      site: companies.site,
      address: companies.address,
      city: companies.city,
      state: companies.state,
      country: companies.country,
      description: companies.description,
      isPublic: companies.isPublic,
      industry: companies.industry,
      phone: companies.phone,
      employees: companies.employees,
      rating: companies.rating,
      reviewCount: companies.reviewCount,
      reviewsLink: companies.reviewsLink,
      latitude: companies.latitude,
      longitude: companies.longitude,
      timezone: companies.timezone,
      photo: companies.photo,
      categories: companies.categories,
      primaryCategory: companies.primaryCategory,
      status: companies.status,
      assignedUserId: companies.assignedUserId,
      contactName: companies.contactName,
      contactEmail: companies.contactEmail,
      contactPhone: companies.contactPhone,
      notes: companies.notes,
      lastContactedAt: companies.lastContactedAt,
      customDomain: companies.customDomain,
      domainSetupComplete: companies.domainSetupComplete,
      createdAt: companies.createdAt,
      updatedAt: companies.updatedAt
    }).from(companies).orderBy(companies.name);
    
    // Add the new fields with default values
    return results.map(company => ({
      ...company,
      leadStatus: 'new',
      pipelineStage: 'new_lead'
    }));
  }
  
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }
  
  async getCompanyBySlug(slug: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.slug, slug));
    return company;
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    // If slug is not provided, generate one from the name
    if (!insertCompany.slug) {
      const slug = insertCompany.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      
      insertCompany.slug = slug;
    }
    
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }
  
  async updateCompany(id: number, companyUpdate: Partial<Company>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...companyUpdate, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    
    return updatedCompany;
  }
  
  // Service methods
  async getServicesForCompany(companyId: number): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.companyId, companyId))
      .orderBy(services.order);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }
  
  // Review methods
  async getReviewsForCompany(companyId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.companyId, companyId))
      .orderBy(desc(reviews.createdAt));
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }
  
  // Page visit methods
  async recordPageVisit(visit: InsertPageVisit): Promise<PageVisit> {
    const [pageVisit] = await db.insert(pageVisits).values(visit).returning();
    return pageVisit;
  }
  
  async getPageVisitsForCompany(companyId: number, limit: number = 100): Promise<PageVisit[]> {
    return await db
      .select()
      .from(pageVisits)
      .where(eq(pageVisits.companyId, companyId))
      .orderBy(desc(pageVisits.visitedAt))
      .limit(limit);
  }
  
  // Visitor session methods
  async startVisitorSession(sessionData: InsertVisitorSession): Promise<VisitorSession> {
    const [session] = await db.insert(visitorSessions).values(sessionData).returning();
    return session;
  }
  
  async endVisitorSession(id: number, duration: number): Promise<VisitorSession | undefined> {
    const [session] = await db
      .update(visitorSessions)
      .set({ 
        endedAt: new Date(),
        duration
      })
      .where(eq(visitorSessions.id, id))
      .returning();
    
    return session;
  }
  
  async getVisitorSessionsForCompany(companyId: number, limit: number = 100): Promise<VisitorSession[]> {
    return await db
      .select()
      .from(visitorSessions)
      .where(eq(visitorSessions.companyId, companyId))
      .orderBy(desc(visitorSessions.startedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
