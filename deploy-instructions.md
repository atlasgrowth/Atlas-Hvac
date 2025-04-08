# How to Deploy Atlas Growth

Follow these steps to properly deploy your application on Replit:

## Step 1: Deploy Your App
1. Click the "Deploy" button in Replit
2. Choose your deployment settings and click "Deploy"
3. Wait for the deployment to complete

## Step 2: Initialize the Database
After deployment, you need to run the following commands in the Replit Shell:

```bash
# Run this command to create admin user
npx tsx server/createAdmin.ts

# Run this command to import company data
npx tsx server/importCsvData.ts
```

## Step 3: Log In to Your App
Once the database is initialized, you can log in with:
- Username: `admin`
- Password: `admin123`
- Or username: `nick` (if you already set this up)

## Alternative: Run the Init Script
If the above commands don't work individually, try running:

```bash
# Option 1: Run the shell script
bash init-database.sh

# Option 2: Run the Node.js script
node init-production-database.js
```

## Troubleshooting
If you see "Company already exists" messages, that's normal and means the data is already in the database.

If you still have issues logging in, you may need to reset your database and run the initialization again.