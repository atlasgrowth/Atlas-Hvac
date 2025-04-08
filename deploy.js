// This script automatically runs database initialization for deployment
// It will:
// 1. Create the admin user
// 2. Import all company data from CSV files

import { execSync } from 'child_process';

console.log('===== DEPLOYMENT DATABASE INITIALIZATION =====');

try {
  // Step 1: Create admin user
  console.log('\n[1/2] Creating admin user...');
  execSync('npx tsx server/createAdmin.ts', { stdio: 'inherit' });

  // Step 2: Import company data
  console.log('\n[2/2] Importing company data from CSV files...');
  execSync('npx tsx server/importCsvData.ts', { stdio: 'inherit' });

  console.log('\n===== DATABASE INITIALIZATION COMPLETE =====');
  console.log('You can now log in using:');
  console.log('Username: admin');
  console.log('Password: admin123');
} catch (error) {
  console.error('Error during deployment setup:', error);
}