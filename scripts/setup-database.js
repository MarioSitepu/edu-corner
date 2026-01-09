// Script untuk membuat tabel di database Neon
// Jalankan dengan: node scripts/setup-database.js

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('Membuat tabel edu_corner...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS edu_corner (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        cita_cita TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Membuat index...');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at 
      ON edu_corner(created_at DESC)
    `;

    console.log('✓ Database berhasil di-setup!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

