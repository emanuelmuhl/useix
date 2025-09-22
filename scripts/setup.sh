#!/bin/bash

# Userix Setup Script
echo "🚀 Userix Setup wird gestartet..."

# Prüfe ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installiere Node.js 18+ und versuche es erneut."
    exit 1
fi

# Prüfe ob Docker installiert ist
if ! command -v docker &> /dev/null; then
    echo "❌ Docker ist nicht installiert. Bitte installiere Docker und versuche es erneut."
    exit 1
fi

# Kopiere .env Datei
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ .env Datei erstellt. Bitte passe die Werte nach Bedarf an."
else
    echo "ℹ️ .env Datei existiert bereits."
fi

# Installiere Dependencies
echo "📦 Installiere Dependencies..."

# Root Dependencies
npm install

# Backend Dependencies
cd backend && npm install && cd ..

# Frontend Dependencies  
cd frontend && npm install && cd ..

# Shared Dependencies
cd shared && npm install && cd ..

echo "✅ Alle Dependencies installiert!"

# Build Shared Package
echo "🔧 Baue Shared Package..."
cd shared && npm run build && cd ..

echo "🎉 Setup abgeschlossen!"
echo ""
echo "🚀 Nächste Schritte:"
echo "1. Starte die Services: npm run dev"
echo "2. Oder mit Docker: npm run docker:up"
echo "3. Backend API: http://localhost:3101"
echo "4. Frontend: http://localhost:3102"
echo "5. API Docs: http://localhost:3101/api/docs"
