# Userix - Schulverwaltungs-SaaS

Eine mandantenfähige SaaS-Webapp für Schulen zur zentralen Verwaltung von Schüler:innen-Logins, Klassen und Lehrpersonen.

## 🏗️ Projektstruktur

```
useix/
├── backend/          # NestJS API Server
├── frontend/         # Next.js React App
├── shared/           # Gemeinsame TypeScript Types
├── docker/           # Docker Konfigurationen
├── docs/             # Dokumentation
└── scripts/          # Build & Deployment Scripts
```

## 🚀 Quick Start

### Entwicklungsumgebung

```bash
# Backend starten (Port 3101)
cd backend && npm run dev

# Frontend starten (Port 3102)
cd frontend && npm run dev
```

### Docker Deployment

```bash
docker-compose up -d
```

## 🎯 Kernfunktionen

### Für Schulen (Mandanten)
- **Schüler:innen-Verwaltung**: Eindeutige IDs, Stammdaten, CSV-Import
- **Lehrpersonen-Verwaltung**: Separate Verwaltung mit Relationen
- **Export & Reporting**: PDF-Reports, Excel-Export, Etikettendruck

### Entwickler-Admin-Konsole
- **Mandantenverwaltung**: Neue Schulen anlegen, eigene DBs
- **Benutzeradministration**: Admin-Accounts, Passwort-Reset
- **Deployment**: Versionierung, Docker-Container

## 🛠️ Tech Stack

- **Backend**: NestJS, PostgreSQL, JWT Auth
- **Frontend**: Next.js, React, Tailwind CSS
- **Deployment**: Docker, Proxmox
- **CI/CD**: GitHub Actions

## 📊 Datenbank

Jeder Mandant erhält eine eigene PostgreSQL-Datenbank für maximale Datentrennung.

## 🔐 Sicherheit

- JWT-basierte Authentifizierung
- Passwort-Hashing mit bcrypt
- Admin-Rollenmodell
- Mandantentrennung auf DB-Ebene
