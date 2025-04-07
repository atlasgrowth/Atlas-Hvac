import { db } from './db';
import { storage } from './storage';
import { InsertUser } from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Function to hash a password
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    console.log('Checking for existing admin user...');
    
    // Check if admin already exists
    const existingAdmin = await storage.getUserByUsername('admin');
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }
    
    console.log('Creating admin user...');
    
    // Create admin user data
    const adminUser: InsertUser = {
      username: 'admin',
      password: await hashPassword('admin123'),
      email: 'admin@example.com',
      firstName: 'Nick',
      lastName: 'Sanford',
      role: 'admin'
    };
    
    // Save to database
    const user = await storage.createUser(adminUser);
    console.log('Admin user created successfully:', {
      id: user.id,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the function
createAdminUser();