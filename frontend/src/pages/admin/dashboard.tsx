import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PlusIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { tenantsApi, dashboardApi } from '../../lib/api';

interface SystemStats {
  totalTenants: number;
  activeTenants: number;
  totalStudents: number;
  totalTeachers: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  createdAt: string;
  stats: {
    students: number;
    teachers: number;
  };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<SystemStats>({
    totalTenants: 0,
    activeTenants: 0,
    totalStudents: 0,
    totalTeachers: 0,
    systemHealth: 'healthy',
  });
  
  const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Load dashboard data
  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [tenantsResponse, systemStats] = await Promise.all([
        tenantsApi.getAll(1, 10),
        dashboardApi.getStats(),
      ]);

      // Calculate system stats
      const tenants = tenantsResponse.data || [];
      const totalStudents = tenants.reduce((sum: number, t: any) => sum + (t.stats?.students || 0), 0);
      const totalTeachers = tenants.reduce((sum: number, t: any) => sum + (t.stats?.teachers || 0), 0);

      setStats({
        totalTenants: tenantsResponse.total || 0,
        activeTenants: tenants.filter(t => t.isActive).length,
        totalStudents,
        totalTeachers,
        systemHealth: 'healthy',
      });

      setRecentTenants(tenants.slice(0, 5));

    } catch (error: any) {
      console.error('Error loading admin dashboard:', error);
      setError('Fehler beim Laden der Dashboard-Daten');
      
      // Mock data for development
      setStats({
        totalTenants: 3,
        activeTenants: 3,
        totalStudents: 1247,
        totalTeachers: 89,
        systemHealth: 'healthy',
      });

      setRecentTenants([
        {
          id: '1',
          name: 'Beispiel Grundschule',
          subdomain: 'beispielschule',
          isActive: true,
          createdAt: new Date().toISOString(),
          stats: { students: 245, teachers: 18 }
        },
        {
          id: '2',
          name: 'Max-Mustermann-Realschule',
          subdomain: 'mustermann-rs',
          isActive: true,
          createdAt: new Date().toISOString(),
          stats: { students: 487, teachers: 32 }
        },
        {
          id: '3',
          name: 'Gymnasium am Park',
          subdomain: 'gym-park',
          isActive: true,
          createdAt: new Date().toISOString(),
          stats: { students: 515, teachers: 39 }
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHealthIcon = (health: SystemStats['systemHealth']) => {
    switch (health) {
      case 'healthy':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
                <p className="text-sm text-gray-600">
                  Userix Multi-Tenant Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getHealthIcon(stats.systemHealth)}
                <span className="text-sm text-gray-600">System Status</span>
              </div>
              <span className="text-sm text-gray-500">System Administrator</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md mb-6">
            {error} (Zeige Demo-Daten)
          </div>
        )}

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Mandanten
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? '...' : stats.totalTenants}
                      </div>
                      <div className="ml-2 text-sm font-medium text-green-600">
                        {stats.activeTenants} aktiv
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Schüler gesamt
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {isLoading ? '...' : stats.totalStudents.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Lehrkräfte gesamt
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {isLoading ? '...' : stats.totalTeachers.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      System-Status
                    </dt>
                    <dd className="text-2xl font-semibold text-green-600">
                      Healthy
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System-Verwaltung</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/tenants"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    Mandanten verwalten
                  </span>
                </Link>

                <Link
                  href="/admin/tenants/create"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
                >
                  <PlusIcon className="h-8 w-8 text-gray-400 group-hover:text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-green-600">
                    Neuer Mandant
                  </span>
                </Link>

                <Link
                  href="/admin/system"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                >
                  <CogIcon className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                    System-Einstellungen
                  </span>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
                >
                  <ChartBarIcon className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
                    Analytics
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Tenants */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Mandanten-Übersicht</h3>
              <Link
                href="/admin/tenants"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Alle anzeigen →
              </Link>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : recentTenants.length === 0 ? (
                <div className="text-center py-4">
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Keine Mandanten vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${tenant.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{tenant.name}</h4>
                          <p className="text-xs text-gray-500">{tenant.subdomain}.userix.de</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">
                          {tenant.stats.students} Schüler
                        </div>
                        <div className="text-xs text-gray-500">
                          {tenant.stats.teachers} Lehrkräfte
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
