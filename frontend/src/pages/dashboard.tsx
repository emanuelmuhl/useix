import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { studentsApi, teachersApi, tenantsApi } from '../lib/api';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeUsers: number;
  recentChanges: number;
}

interface RecentActivity {
  id: string;
  type: 'student_added' | 'teacher_added' | 'student_updated' | 'export_generated';
  description: string;
  timestamp: string;
  user: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    activeUsers: 0,
    recentChanges: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Load stats based on user role
        if (user.role === 'admin') {
          // System admin sees all tenants
          const tenantsResponse = await tenantsApi.getAll(1, 100);
          const totalTenants = tenantsResponse.data?.length || 0;
          
          setStats({
            totalStudents: totalTenants * 245, // Mock calculation
            totalTeachers: totalTenants * 18,
            totalClasses: totalTenants * 12,
            activeUsers: totalTenants * 198,
            recentChanges: 15,
          });
        } else if (user.tenantId) {
          // Tenant admin sees their tenant data
          const [studentsResponse, teachersResponse, tenantStats] = await Promise.all([
            studentsApi.getAll({ page: 1, limit: 1 }),
            teachersApi.getAll(user.tenantId),
            tenantsApi.getStats(user.tenantId),
          ]);

          setStats({
            totalStudents: studentsResponse.total || 0,
            totalTeachers: teachersResponse.data?.length || 0,
            totalClasses: tenantStats.totalClasses || 0,
            activeUsers: tenantStats.activeUsers || 0,
            recentChanges: 8,
          });
        }

        // Mock recent activity data
        setRecentActivity([
          {
            id: '1',
            type: 'student_added',
            description: 'Max Mustermann wurde zur Klasse PR1A hinzugefügt',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            user: 'Anna Schmidt',
          },
          {
            id: '2',
            type: 'export_generated',
            description: 'Schülerliste als CSV exportiert',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            user: 'Thomas Weber',
          },
          {
            id: '3',
            type: 'teacher_added',
            description: 'Neue Lehrkraft Maria Müller hinzugefügt',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            user: 'Anna Schmidt',
          },
          {
            id: '4',
            type: 'student_updated',
            description: 'iPad-Code für Lisa Wagner aktualisiert',
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            user: 'Thomas Weber',
          },
        ]);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Gerade eben';
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min.`;
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)} Std.`;
    return `vor ${Math.floor(diffInMinutes / 1440)} Tagen`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'student_added':
        return <UserGroupIcon className="h-4 w-4 text-green-500" />;
      case 'teacher_added':
        return <AcademicCapIcon className="h-4 w-4 text-blue-500" />;
      case 'student_updated':
        return <CogIcon className="h-4 w-4 text-orange-500" />;
      case 'export_generated':
        return <DocumentTextIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ChartBarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isAuthenticated || !user) {
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
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.role === 'admin' ? 'System Dashboard' : 'Schul-Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  Willkommen zurück, {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user.role === 'admin' ? 'System Administrator' : 'Schul-Administrator'}
              </span>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Schüler
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? '...' : stats.totalStudents.toLocaleString()}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">Increased by</span>
                        12
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
                  <AcademicCapIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Lehrkräfte
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? '...' : stats.totalTeachers.toLocaleString()}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">Increased by</span>
                        2
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
                  <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Klassen
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? '...' : stats.totalClasses.toLocaleString()}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                        <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">Decreased by</span>
                        1
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
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aktive Benutzer
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? '...' : stats.activeUsers.toLocaleString()}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">Increased by</span>
                        24
                      </div>
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
              <h3 className="text-lg font-medium text-gray-900">Schnellaktionen</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/students"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                  <UserGroupIcon className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    Schüler verwalten
                  </span>
                </Link>

                <Link
                  href="/teachers"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
                >
                  <AcademicCapIcon className="h-8 w-8 text-gray-400 group-hover:text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-green-600">
                    Lehrkräfte verwalten
                  </span>
                </Link>

                <Link
                  href="/students/import"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
                >
                  <PlusIcon className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
                    CSV Import
                  </span>
                </Link>

                <Link
                  href="/reports"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                >
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                    Berichte erstellen
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Letzte Aktivitäten</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/activity"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Alle Aktivitäten anzeigen →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}