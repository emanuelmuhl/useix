import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual admin login API call
      console.log('Admin login:', { email, password });
      
      // Simulate login success
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Admin login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin-Login - Userix</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Admin-Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entwickler-Admin-Konsole für Mandantenverwaltung
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-l-4 border-red-500">
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    <strong>Nur für Entwickler:</strong> Dieser Bereich ist für die Verwaltung aller Mandanten bestimmt.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin E-Mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="admin@userix.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Admin-Passwort
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? 'Wird angemeldet...' : 'Admin-Anmeldung'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Schul-Login
              </Link>
              <span className="mx-2 text-gray-300">|</span>
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
