#!/bin/bash

# This script should be run immediately after deploying your application
# It will initialize the database with admin users and import all company data

echo "===== ATLAS GROWTH DEPLOYMENT SETUP ====="
echo "Running this script will initialize your production database"

echo -e "\n[1/2] Creating admin user..."
npx tsx server/createAdmin.ts

echo -e "\n[2/2] Importing company data from CSV files..."
npx tsx server/importCsvData.ts

echo -e "\n===== DEPLOYMENT SETUP COMPLETE ====="
echo "You can now log in using:"
echo "Username: admin"
echo "Password: admin123"