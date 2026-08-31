import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_sKn6bNkC2dtZ@ep-jolly-wind-aegiwscs-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Tables
export async function initDB() {
  try {
    const client = await pool.connect();
    console.log('📦 Connected to Neon PostgreSQL successfully!');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'patient',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Patient Profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS patient_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        age INTEGER,
        height VARCHAR(50),
        weight_kg NUMERIC(5, 2),
        gender VARCHAR(20),
        blood_group VARCHAR(10),
        chronic_diseases TEXT[] DEFAULT '{}',
        allergies TEXT[] DEFAULT '{}',
        emergency_contact VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✅ Database tables initialized (users, patient_profiles)');
    client.release();
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
  }
}
