#!/bin/bash

echo "🚀 Building Pet Events Web App for production..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "✅ Build completed successfully!"
echo "📁 Frontend build: ./dist"
echo "📁 Backend ready: ./backend"
echo ""
echo "🌐 Ready for deployment to Vercel!"
