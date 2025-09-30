const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Determine if we're in production (Vercel) or development
const isProduction = process.env.NODE_ENV === 'production';

let db;

if (isProduction) {
  // Use PostgreSQL in production
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Use SQLite in development
  const dbPath = path.join(__dirname, 'pet_events.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('📁 Connected to SQLite database');
    }
  });
}

// Database initialization function
function initializeDatabase() {
  if (isProduction) {
    // PostgreSQL initialization
    return initializePostgreSQL();
  } else {
    // SQLite initialization
    return initializeSQLite();
  }
}

function initializeSQLite() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          avatar_url TEXT,
          instagram TEXT,
          about_me TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
        } else {
          console.log('✅ Users table created/verified');
        }
      });

      // Create pets table
      db.run(`
        CREATE TABLE IF NOT EXISTS pets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          breed TEXT,
          age INTEGER,
          description TEXT,
          image_url TEXT,
          owner_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating pets table:', err.message);
          reject(err);
        } else {
          console.log('✅ Pets table created/verified');
        }
      });

      // Create events table
      db.run(`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          location TEXT NOT NULL,
          max_attendees INTEGER DEFAULT 50,
          is_private BOOLEAN DEFAULT 0,
          created_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating events table:', err.message);
          reject(err);
        } else {
          console.log('✅ Events table created/verified');
        }
      });

      // Create reviews table
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          event_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating reviews table:', err.message);
          reject(err);
        } else {
          console.log('✅ Reviews table created/verified');
        }
      });

      // Create event_pets table (many-to-many relationship)
      db.run(`
        CREATE TABLE IF NOT EXISTS event_pets (
          id TEXT PRIMARY KEY,
          event_id TEXT NOT NULL,
          pet_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events (id),
          FOREIGN KEY (pet_id) REFERENCES pets (id),
          UNIQUE(event_id, pet_id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating event_pets table:', err.message);
          reject(err);
        } else {
          console.log('✅ Event_pets table created/verified');
          resolve();
        }
      });
    });
  });
}

function initializePostgreSQL() {
  return new Promise(async (resolve, reject) => {
    try {
      // Create users table
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          avatar_url TEXT,
          instagram TEXT,
          about_me TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Users table created/verified');

      // Create pets table
      await db.query(`
        CREATE TABLE IF NOT EXISTS pets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          breed TEXT,
          age INTEGER,
          description TEXT,
          image_url TEXT,
          owner_id TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users (id)
        )
      `);
      console.log('✅ Pets table created/verified');

      // Create events table
      await db.query(`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          location TEXT NOT NULL,
          max_attendees INTEGER DEFAULT 50,
          is_private BOOLEAN DEFAULT FALSE,
          created_by TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);
      console.log('✅ Events table created/verified');

      // Create reviews table
      await db.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          event_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
      console.log('✅ Reviews table created/verified');

      // Create event_pets table
      await db.query(`
        CREATE TABLE IF NOT EXISTS event_pets (
          id TEXT PRIMARY KEY,
          event_id TEXT NOT NULL,
          pet_id TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events (id),
          FOREIGN KEY (pet_id) REFERENCES pets (id),
          UNIQUE(event_id, pet_id)
        )
      `);
      console.log('✅ Event_pets table created/verified');
      
      resolve();
    } catch (err) {
      console.error('Error initializing PostgreSQL:', err);
      reject(err);
    }
  });
}

// Export database connection and initialization function
module.exports = {
  db,
  initializeDatabase
};