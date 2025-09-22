import Head from 'next/head';
import Link from 'next/link';
import { SchoolBuildingIcon, UserGroupIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <>
      <Head>
        <title>Userix - Schulverwaltungs-SaaS</title>
        <meta name="description" content="Mandantenfähige SaaS-Webapp für Schulverwaltung" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <SchoolBuildingIcon className="h-8 w-8 text-primary-600" />
                <h1 className="ml-3 text-2xl font-bold text-gray-900">Userix</h1>
              </div>
              <div className="flex space-x-4">
                <Link href="/admin/login" className="btn-secondary">
                  Admin Login
                </Link>
                <Link href="/login" className="btn-primary">
                  Schul-Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Moderne Schulverwaltung
              <span className="block text-primary-600">für das digitale Zeitalter</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Userix bietet eine zentrale, mandantenfähige Lösung für die Verwaltung von 
              Schüler:innen-Logins, Klassen und Lehrpersonen. Einfach, sicher und effizient.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card">
              <div className="card-body text-center">
                <UserGroupIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Schüler:innen-Verwaltung</h3>
                <p className="text-gray-600">
                  Zentrale Verwaltung aller Schüler:innen mit eindeutigen IDs, 
                  Office 365 Integration und iPad-Codes.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <SchoolBuildingIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Mandantenfähig</h3>
                <p className="text-gray-600">
                  Jede Schule erhält ihre eigene Instanz mit separater Datenbank 
                  für maximale Datensicherheit.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <DocumentChartBarIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Export & Reporting</h3>
                <p className="text-gray-600">
                  PDF-Reports, Excel-Export und Etikettendruck 
                  für Brother Label Writer - alles integriert.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Bereit für moderne Schulverwaltung?</h3>
            <p className="text-primary-100 mb-6">
              Kontaktieren Sie uns für eine Demo oder weitere Informationen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Demo anfordern
              </Link>
              <Link href="/contact" className="btn border-white text-white hover:bg-primary-700">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 Helplink GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
