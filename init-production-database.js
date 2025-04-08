// This script initializes the production database with:
// 1. Creating an admin user
// 2. Importing company data from CSV files

// Run with: node init-production-database.js

import { exec } from 'child_process';

console.log('===== PRODUCTION DATABASE INITIALIZATION =====');

// First create the admin user
console.log('\n[1/2] Creating admin user...');
exec('node -r tsx/register server/createAdmin.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('Error creating admin user:', error);
    console.error(stderr);
  } else {
    console.log(stdout);
    console.log('Admin user creation completed.');
    
    // Then import the company data
    console.log('\n[2/2] Importing company data from CSV files...');
    exec('node -r tsx/register server/importCsvData.ts', (error, stdout, stderr) => {
      if (error) {
        console.error('Error importing company data:', error);
        console.error(stderr);
      } else {
        console.log(stdout);
        console.log('Company data import completed.');
        console.log('\n===== DATABASE INITIALIZATION COMPLETE =====');
        console.log('You can now log in using:');
        console.log('Username: admin');
        console.log('Password: admin123');
      }
    });
  }
});