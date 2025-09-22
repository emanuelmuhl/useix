-- Userix Database Initialization
-- Diese Datei wird beim ersten Start der PostgreSQL-Instanz ausgeführt

-- Erstelle die Hauptdatenbank (falls nicht existiert)
SELECT 'CREATE DATABASE userix_main' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'userix_main')\gexec

-- Wechsle zur Hauptdatenbank
\c userix_main;

-- Erstelle Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Kommentar für Dokumentation
COMMENT ON DATABASE userix_main IS 'Hauptdatenbank für Userix - Mandantenverwaltung und Meta-Daten';

-- Beispiel für eine Mandanten-Datenbank (wird zur Laufzeit erstellt)
-- CREATE DATABASE userix_tenant_beispielschule;
