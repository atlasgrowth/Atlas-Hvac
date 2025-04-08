# Atlas Growth Production Setup

## Fix for Missing Data on atlasgrowth.ai

The issue on atlasgrowth.ai is that the database hasn't been initialized with an admin user and company data. Follow these steps to fix this:

### Step 1: Copy CSV Files to Your Server

Make sure these two CSV files are available on your production server:
- `Outscraper-20250408011451xs87_birmingham_alabama.csv`
- `Outscraper-20250408011629xs05_fayetteville_arkansas.csv`

### Step 2: Initialize Admin User

Run this command on your production server:
```bash
npx tsx server/createAdmin.ts
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`

### Step 3: Import Company Data

Run this command on your production server:
```bash
npx tsx server/importCsvData.ts
```

This will import all companies from the CSV files into your database.

### Step 4: Log In

After running both commands, you should be able to log in at https://atlasgrowth.ai/auth with:
- Username: `admin`
- Password: `admin123`

## Troubleshooting

If you still see the "input buffers must have same byte length" error:
1. It's likely a database issue with how passwords are stored
2. Try recreating the database and running the setup again
3. You might need to check your database configuration