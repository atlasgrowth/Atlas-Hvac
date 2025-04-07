import { users, type User, type InsertUser, type Company, type InsertCompany, type Service, type InsertService, type Review, type InsertReview } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods (keep existing)
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private services: Map<number, Service>;
  private reviews: Map<number, Review>;
  private userCurrentId: number;
  private companyCurrentId: number;
  private serviceCurrentId: number;
  private reviewCurrentId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.services = new Map();
    this.reviews = new Map();
    this.userCurrentId = 1;
    this.companyCurrentId = 1;
    this.serviceCurrentId = 1;
    this.reviewCurrentId = 1;
  }

  // User methods (keep existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Company methods
  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }
  
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }
  
  async getCompanyBySlug(slug: string): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(
      (company) => company.slug === slug,
    );
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.companyCurrentId++;
    
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
    
    const company: Company = { ...insertCompany, id };
    this.companies.set(id, company);
    return company;
  }
  
  async updateCompany(id: number, companyUpdate: Partial<Company>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany = { ...company, ...companyUpdate };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }
  
  // Service methods
  async getServicesForCompany(companyId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.companyId === companyId,
    );
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceCurrentId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  // Review methods
  async getReviewsForCompany(companyId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.companyId === companyId,
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const review: Review = { ...insertReview, id };
    this.reviews.set(id, review);
    return review;
  }
}

export const storage = new MemStorage();
