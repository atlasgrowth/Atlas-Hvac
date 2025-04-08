#!/bin/bash

echo "===== PRODUCTION DATABASE INITIALIZATION ====="

echo -e "\n[1/2] Creating admin user..."
npx tsx server/createAdmin.ts

echo -e "\n[2/2] Importing company data from CSV files..."
npx tsx server/importCsvData.ts

echo -e "\n===== DATABASE INITIALIZATION COMPLETE ====="
echo "You can now log in using:"
echo "Username: admin"
echo "Password: admin123"