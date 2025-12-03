#!/bin/bash

echo "🏥 Health Check for Job Scraper Application"
echo ""

# Check Docker services
echo "🐳 Checking Docker services..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Docker services running"
    docker-compose ps
else
    echo "❌ Docker services not running"
fi
echo ""

# Check PostgreSQL
echo "🐘 Checking PostgreSQL..."
if docker-compose exec -T postgres pg_isready -U admin >/dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not responding"
fi
echo ""

# Check Redis
echo "📦 Checking Redis..."
if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not responding"
fi
echo ""

# Check Backend API
echo "🔧 Checking Backend API..."
if curl -s http://localhost:3000/scrapers >/dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "⚠️  Backend API is not responding (may not be started)"
fi
echo ""

# Check Frontend
echo "🎨 Checking Frontend..."
if curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "⚠️  Frontend is not responding (may not be started)"
fi
echo ""

echo "Health check complete!"
