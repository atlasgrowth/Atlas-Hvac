import { parseCsvData } from "./utils/csvParser";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

/**
 * This script imports CSV data into the database.
 * It can be used to populate the production database with the initial data set.
 */
async function importCsvData() {
  const csvFiles = [
    "Outscraper-20250408011451xs87_birmingham_alabama.csv",
    "Outscraper-20250408011629xs05_fayetteville_arkansas.csv"
  ];

  console.log("Starting CSV data import...");
  let totalImported = 0;

  try {
    for (const csvFile of csvFiles) {
      const filePath = path.join(process.cwd(), csvFile);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`CSV file not found: ${filePath}`);
        continue;
      }

      console.log(`Processing file: ${csvFile}`);
      const companies = await parseCsvData(filePath);
      console.log(`Found ${companies.length} companies in ${csvFile}`);

      // Import companies into the database
      let importedCount = 0;
      for (const company of companies) {
        try {
          // Check if company already exists (to avoid duplicates)
          const existingCompany = await storage.getCompanyBySlug(company.slug);
          
          if (!existingCompany) {
            await storage.createCompany(company);
            importedCount++;
          } else {
            console.log(`Company already exists: ${company.name} (${company.slug})`);
          }
        } catch (error) {
          console.error(`Error importing company ${company.name}:`, error);
        }
      }

      console.log(`Imported ${importedCount} new companies from ${csvFile}`);
      totalImported += importedCount;
    }

    console.log(`CSV data import complete. Total new companies imported: ${totalImported}`);
  } catch (error) {
    console.error("Error during CSV data import:", error);
  }
}

// Run the import function
importCsvData()
  .then(() => {
    console.log("Import process finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import process failed:", error);
    process.exit(1);
  });