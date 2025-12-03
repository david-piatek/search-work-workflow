#!/bin/bash

set -e

echo "🚀 Initializing Job Scraper Application..."
echo ""

# Check if required tools are installed
echo "📋 Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting."; exit 1; }

echo "✅ All prerequisites installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Setup environment files
echo "⚙️  Setting up environment files..."
if [ ! -f apps/backend/.env ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env"
else
    echo "⚠️  apps/backend/.env already exists, skipping"
fi
echo ""

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data
mkdir -p backup
echo "✅ Data directories created"
echo ""

# Setup git hooks
echo "🔧 Setting up git hooks..."
npx husky install
chmod +x .husky/pre-commit .husky/pre-push
echo "✅ Git hooks configured"
echo ""

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL & Redis)..."
docker-compose up -d postgres redis
echo "✅ Docker services started"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5
echo "✅ Services ready"
echo ""

echo "🎉 Initialization complete!"
echo ""
echo "Next steps:"
echo "  1. Start development: task dev"
echo "  2. Access frontend: http://localhost:5173"
echo "  3. Access backend: http://localhost:3000"
echo "  4. View API docs: http://localhost:3000/api"
echo ""
echo "For more information, see:"
echo "  - QUICKSTART.md"
echo "  - README.md"
echo ""
