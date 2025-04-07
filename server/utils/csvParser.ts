import fs from "fs";
import { parse } from "csv-parse/sync";
import { InsertCompany } from "@shared/schema";

export async function parseCsvData(filePath: string): Promise<InsertCompany[]> {
  // Read the CSV file
  const fileContent = await fs.promises.readFile(filePath, { encoding: "utf-8" });
  
  // Parse the CSV data
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  
  // Process and transform the CSV data into company objects
  const companies: InsertCompany[] = records.map((record: any, index: number) => {
    // Clean and extract data from the record
    const query = record.query || "";
    const parts = query.split(",").map((p: string) => p.trim());
    const location = parts.slice(1).join(", ");
    
    // Create a unique slug from the name
    const name = record.name || `HVAC Company ${index + 1}`;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    // Extract the city and state from record or query
    let city = record["site.company_insights.city"] || "";
    let state = record["site.company_insights.state"] || "";
    
    if (!city || !state) {
      const locationParts = location.split(",");
      if (locationParts.length >= 2) {
        city = city || locationParts[0].trim();
        state = state || locationParts[1].trim();
      }
    }
    
    // Create the company object
    const company: InsertCompany = {
      slug,
      name,
      nameForEmails: record.name_for_emails || name,
      site: record.site || "",
      address: record["site.company_insights.address"] || "",
      city,
      state,
      country: record["site.company_insights.country"] || "US",
      description: record["site.company_insights.description"] || "",
      isPublic: record["site.company_insights.is_public"] === "TRUE",
      industry: record["site.company_insights.industry"] || "HVAC contractor",
      phone: record.phone || "",
      employees: record["site.company_insights.employees"] || "",
      rating: parseFloat(record.rating) || 0,
      reviewCount: parseInt(record.review_count) || 0,
      reviewsLink: record.reviews_link || "",
      latitude: parseFloat(record.latitude) || undefined,
      longitude: parseFloat(record.longitude) || undefined,
      timezone: record.timezone || "America/Chicago",
      photo: "", // Will be filled with a stock photo URL in the frontend
      categories: record.categories 
        ? record.categories.split(",").map((c: string) => c.trim()) 
        : ["HVAC contractor"],
      primaryCategory: record.primary_category || "HVAC contractor",
    };
    
    return company;
  });
  
  return companies;
}
