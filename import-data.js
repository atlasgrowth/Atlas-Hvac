// Simple script to run the data import
// You can run this with: node import-data.js

import { execSync } from 'child_process';

try {
  console.log('Starting data import...');
  execSync('npx tsx server/importCsvData.ts', { stdio: 'inherit' });
  console.log('Data import complete.');
} catch (error) {
  console.error('Error during data import:', error);
  process.exit(1);
}