import { pgTable, text, serial, integer, boolean, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping the existing table)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Companies table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameForEmails: text("name_for_emails"),
  site: text("site"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
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
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").default(0),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
  initials: text("initials"),
  avatarColor: text("avatar_color"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompanySchema = createInsertSchema(companies);

export const insertServiceSchema = createInsertSchema(services);

export const insertReviewSchema = createInsertSchema(reviews);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
