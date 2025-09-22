import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 245,
    totalTeachers: 18,
    totalClasses: 12,
    activeUsers: 198
  });

  const recentActivities = [
    { id: 1, action: 'Neuer Schüler hinzugefügt', user: 'Max Mustermann', time: 'vor 2 Minuten', type: 'student' },
    { id: 2, action: 'CSV-Import abgeschlossen', user: 'System', time: 'vor 15 Minuten', type: 'import' },
    { id: 3, action: 'Lehrerin aktualisiert', user: 'Anna Schmidt', time: 'vor 1 Stunde', type: 'teacher' },
    { id: 4, action: 'Klasse PR2A erstellt', user: 'Admin', time: 'vor 2 Stunden', type: 'class' },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Userix</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900">Userix Dashboard</h1>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
                <Link href="/students" className="text-gray-600 hover:text-gray-900">Schüler:innen</Link>
                <Link href="/teachers" className="text-gray-600 hover:text-gray-900">Lehrpersonen</Link>
                <Link href="/classes" className="text-gray-600 hover:text-gray-900">Klassen</Link>
                <Link href="/exports" className="text-gray-600 hover:text-gray-900">Export</Link>
              </nav>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Beispiel-Schule</span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Willkommen zurück!</h2>
            <p className="text-gray-600">Hier ist eine Übersicht Ihrer Schuldaten</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Schüler:innen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Lehrpersonen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Klassen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktive Benutzer</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Letzte Aktivitäten</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                        activity.type === 'student' ? 'bg-blue-500' :
                        activity.type === 'teacher' ? 'bg-green-500' :
                        activity.type === 'class' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {activity.type === 'student' ? 'S' :
                         activity.type === 'teacher' ? 'L' :
                         activity.type === 'class' ? 'K' : 'I'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Schnellaktionen</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/students/new" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Schüler:in hinzufügen</p>
                  </Link>

                  <Link href="/imports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">CSV Import</p>
                  </Link>

                  <Link href="/exports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Daten exportieren</p>
                  </Link>

                  <Link href="/reports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">PDF Reports</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
