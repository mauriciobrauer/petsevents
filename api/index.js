// Vercel serverless function for the backend
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const eventRoutes = require('../backend/routes/events');
const petRoutes = require('../backend/routes/pets');
const reviewRoutes = require('../backend/routes/reviews');
const userRoutes = require('../backend/routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://pet-events-frontend.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pet Events API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
