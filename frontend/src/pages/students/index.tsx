import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  ipadCode: string;
  className: string;
  classAddition?: string;
  teacher?: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      studentId: 'STU-2024-001',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@schule.de',
      ipadCode: '1234',
      className: 'PR1',
      classAddition: 'A',
      teacher: 'Frau Schmidt'
    },
    {
      id: '2',
      studentId: 'STU-2024-002',
      firstName: 'Anna',
      lastName: 'Weber',
      email: 'anna.weber@schule.de',
      ipadCode: '5678',
      className: 'PR1',
      classAddition: 'A',
      teacher: 'Frau Schmidt'
    },
    {
      id: '3',
      studentId: 'STU-2024-003',
      firstName: 'Tom',
      lastName: 'Fischer',
      email: 'tom.fischer@schule.de',
      ipadCode: '9012',
      className: 'PR2',
      classAddition: 'B',
      teacher: 'Herr Mueller'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || student.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = Array.from(new Set(students.map(s => s.className)));

  return (
    <>
      <Head>
        <title>Schüler:innen-Verwaltung - Userix</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <h1 className="ml-3 text-xl font-semibold text-gray-900">Userix</h1>
                </Link>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/students" className="text-blue-600 font-medium">Schüler:innen</Link>
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
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Schüler:innen-Verwaltung</h2>
                <p className="text-gray-600 mt-1">{filteredStudents.length} Schüler:innen gefunden</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/students/import" 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  CSV Import
                </Link>
                <Link href="/students/new" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Schüler:in hinzufügen
                </Link>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Suchen
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Name oder Schüler-ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                  Klasse
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Alle Klassen</option>
                  {classes.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedClass('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schüler:in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schüler-ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klasse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      iPad-Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lehrperson
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.className}{student.classAddition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {student.ipadCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.teacher || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            Bearbeiten
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Löschen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Schüler:innen gefunden</h3>
              <p className="mt-1 text-sm text-gray-500">
                Versuchen Sie andere Suchkriterien oder fügen Sie neue Schüler:innen hinzu.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
