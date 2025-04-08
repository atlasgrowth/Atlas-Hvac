import { pgTable, text, serial, integer, boolean, jsonb, doublePrecision, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'user']);

// Users table (enhanced)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: userRoleEnum("role").default('admin'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Status enum for companies/prospects
export const companyStatusEnum = pgEnum('company_status', ['prospect', 'active', 'inactive', 'archived']);

// Pipeline stage enum for leads and prospects
export const pipelineStageEnum = pgEnum('pipeline_stage', ['new_lead', 'contacted', 'website_sent', 'website_viewed', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost']);

// Companies table (enhanced with prospect and pipeline fields)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameForEmails: text("name_for_emails"),
  site: text("site"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("US"),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  industry: text("industry"),
  phone: text("phone"),
  employees: text("employees"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  reviewsLink: text("reviews_link"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  timezone: text("timezone"),
  photo: text("photo"),
  categories: text("categories").array(),
  primaryCategory: text("primary_category"),
  
  // Fields for prospect/client management
  status: companyStatusEnum("status").default('prospect'),
  
  // Pipeline and lead management fields
  leadStatus: text("lead_status").default('new'), // new, in_pipeline, converted, lost
  pipelineStage: pipelineStageEnum("pipeline_stage").default('new_lead'),
  pipelineValue: integer("pipeline_value"), // Estimated deal value
  pipelineProbability: integer("pipeline_probability"), // Percentage, e.g. 25, 50, 75
  
  // Contact fields  
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  
  // Domain fields
  customDomain: text("custom_domain"),
  domainSetupComplete: boolean("domain_setup_complete").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
  initials: text("initials"),
  avatarColor: text("avatar_color"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Page visits tracking table
export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  visitorId: text("visitor_id").notNull(), // Cookie-based identifier
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ip: text("ip"),
  duration: integer("duration"), // in seconds
  visitedAt: timestamp("visited_at").defaultNow(),
});

// Visitor sessions table
export const visitorSessions = pgTable("visitor_sessions", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  visitorId: text("visitor_id").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // in seconds
  pageCount: integer("page_count").default(0),
  userAgent: text("user_agent"),
  ip: text("ip"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
});

// Contact interaction types
export const interactionTypeEnum = pgEnum('interaction_type', ['call', 'email', 'meeting', 'note', 'task']);

// Contact interactions table for tracking all prospect/client interactions
export const contactInteractions = pgTable("contact_interactions", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  userId: integer("user_id").notNull().references(() => users.id),
  type: interactionTypeEnum("type").notNull(),
  summary: text("summary").notNull(),
  details: text("details"),
  outcome: text("outcome"),
  duration: integer("duration"), // in minutes for calls/meetings
  scheduledAt: timestamp("scheduled_at"), // for future tasks/meetings
  completedAt: timestamp("completed_at"), // for tracking completion
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  assignedCompanies: many(companies),
  contactInteractions: many(contactInteractions),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [companies.assignedUserId],
    references: [users.id],
  }),
  services: many(services),
  reviews: many(reviews),
  pageVisits: many(pageVisits),
  visitorSessions: many(visitorSessions),
  contactInteractions: many(contactInteractions),
}));

export const contactInteractionsRelations = relations(contactInteractions, ({ one }) => ({
  company: one(companies, {
    fields: [contactInteractions.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [contactInteractions.userId],
    references: [users.id],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  company: one(companies, {
    fields: [services.companyId],
    references: [companies.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  company: one(companies, {
    fields: [reviews.companyId],
    references: [companies.id],
  }),
}));

export const pageVisitsRelations = relations(pageVisits, ({ one }) => ({
  company: one(companies, {
    fields: [pageVisits.companyId],
    references: [companies.id],
  }),
}));

export const visitorSessionsRelations = relations(visitorSessions, ({ one }) => ({
  company: one(companies, {
    fields: [visitorSessions.companyId],
    references: [companies.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(['admin', 'manager', 'user']).default('admin'),
}).omit({
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export const insertCompanySchema = createInsertSchema(companies, {
  status: z.enum(['prospect', 'active', 'inactive', 'archived']).default('prospect'),
  pipelineStage: z.enum(['new_lead', 'contacted', 'website_sent', 'website_viewed', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost']).default('new_lead'),
  leadStatus: z.enum(['new', 'in_pipeline', 'converted', 'lost']).default('new'),
}).omit({
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true, 
  createdAt: true
});

export const insertPageVisitSchema = createInsertSchema(pageVisits).omit({
  id: true
});

export const insertVisitorSessionSchema = createInsertSchema(visitorSessions).omit({
  id: true
});

export const insertContactInteractionSchema = createInsertSchema(contactInteractions, {
  type: z.enum(['call', 'email', 'meeting', 'note', 'task']).default('note'),
}).omit({
  id: true,
  createdAt: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertPageVisit = z.infer<typeof insertPageVisitSchema>;
export type PageVisit = typeof pageVisits.$inferSelect;

export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;
export type VisitorSession = typeof visitorSessions.$inferSelect;

export type InsertContactInteraction = z.infer<typeof insertContactInteractionSchema>;
export type ContactInteraction = typeof contactInteractions.$inferSelect;
