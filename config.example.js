// Pet Events Web App - Configuration Example
// Copy this file to config.js and modify as needed

module.exports = {
  // Backend Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    path: process.env.DB_PATH || './database/pet_events.db'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  
  // File Upload Configuration
  uploads: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880 // 5MB
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api'
  }
};
