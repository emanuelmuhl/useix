import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Userix - Schulverwaltungs-SaaS</title>
        <meta name="description" content="Mandantenfähige SaaS-Webapp für Schulverwaltung" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900">Userix</h1>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin/login" 
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                  Admin Login
                </Link>
                <Link href="/login" 
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                  Schul-Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Moderne Schulverwaltung
                <span className="block text-blue-600 mt-2">für das digitale Zeitalter</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Userix bietet eine zentrale, mandantenfähige Lösung für die Verwaltung von 
                Schüler:innen-Logins, Klassen und Lehrpersonen. Einfach, sicher und effizient.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/demo" 
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  Demo anfordern
                </Link>
                <Link href="/contact" 
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  Mehr erfahren
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Schüler:innen-Verwaltung</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Zentrale Verwaltung aller Schüler:innen mit eindeutigen IDs, 
                  Office 365 Integration und iPad-Codes.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mandantenfähig</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Jede Schule erhält ihre eigene Instanz mit separater Datenbank 
                  für maximale Datensicherheit.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Export & Reporting</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PDF-Reports, Excel-Export und Etikettendruck 
                  für Brother Label Writer - alles integriert.
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                System läuft - Frontend erfolgreich deployed
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">© 2024 Helplink GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </footer>
      </div>
    </>
  );
}