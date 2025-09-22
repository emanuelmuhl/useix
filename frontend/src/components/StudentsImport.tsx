import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  DocumentArrowUpIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { studentsApi } from '../lib/api';

interface ImportResult {
  imported: number;
  errors: string[];
  students: any[];
}

export default function StudentsImport() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Bitte wählen Sie eine CSV-Datei aus');
      return;
    }

    setSelectedFile(file);
    setError('');
    setImportResult(null);
    
    // Preview CSV content
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, ''));
      
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        headers?.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
      
      setPreviewData(preview);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!selectedFile || !user?.tenantId) return;

    setIsUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, ''));
        
        const students = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const student: any = {};
          
          headers?.forEach((header, index) => {
            const key = header.toLowerCase();
            if (key.includes('vorname') || key.includes('firstname')) {
              student.firstName = values[index];
            } else if (key.includes('nachname') || key.includes('lastname')) {
              student.lastName = values[index];
            } else if (key.includes('email') || key.includes('e-mail')) {
              student.email = values[index];
            } else if (key.includes('klasse') || key.includes('class')) {
              student.className = values[index];
            } else if (key.includes('ipad') || key.includes('code')) {
              student.ipadCode = values[index];
            } else if (key.includes('password') || key.includes('passwort')) {
              student.office365Password = values[index];
            }
          });
          
          // Generate missing data
          if (!student.ipadCode) {
            student.ipadCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          }
          if (!student.office365Password) {
            student.office365Password = `Temp${Math.floor(Math.random() * 1000)}!`;
          }
          
          return student;
        }).filter(s => s.firstName && s.lastName && s.email);

        const result = await studentsApi.import(user.tenantId!, students);
        setImportResult(result);
      };
      reader.readAsText(selectedFile);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Fehler beim Import');
    } finally {
      setIsUploading(false);
    }
  };

  const sampleCsvContent = `Vorname,Nachname,Email,Klasse,iPad-Code,Office365-Passwort
Max,Mustermann,max.mustermann@beispielschule.de,PR1A,1234,TempPass123
Anna,Schmidt,anna.schmidt@beispielschule.de,PR1A,5678,TempPass456
Leon,Weber,leon.weber@beispielschule.de,PR2B,9012,TempPass789`;

  const downloadSampleCsv = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schueler_vorlage.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
              <Link href="/students" className="text-indigo-600 hover:text-indigo-800 mr-4">
                ← Schüler-Verwaltung
              </Link>
              <DocumentArrowUpIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CSV-Import</h1>
                <p className="text-sm text-gray-600">Schüler aus CSV-Datei importieren</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Import-Anleitung</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• CSV-Datei mit Spalten: Vorname, Nachname, Email, Klasse</p>
                <p>• Optionale Spalten: iPad-Code, Office365-Passwort</p>
                <p>• Erste Zeile muss Spaltennamen enthalten</p>
                <p>• Maximale Dateigröße: 10 MB</p>
              </div>
              <button
                onClick={downloadSampleCsv}
                className="mt-3 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Beispiel-CSV herunterladen
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Datei auswählen</h3>
          </div>
          <div className="p-6">
            <div className="max-w-lg mx-auto">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>CSV-Datei auswählen</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">oder per Drag & Drop</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV bis zu 10MB</p>
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <DocumentArrowUpIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{selectedFile.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        {previewData.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Vorschau (erste 5 Zeilen)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0] || {}).map((key) => (
                      <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleImport}
                disabled={isUploading || !selectedFile}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importiere...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Schüler importieren
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-sm text-red-600">{error}</div>
            </div>
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Import-Ergebnis</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {importResult.imported} Schüler erfolgreich importiert
                  </h4>
                  <p className="text-sm text-gray-600">
                    {importResult.errors.length > 0 && `${importResult.errors.length} Fehler aufgetreten`}
                  </p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-yellow-800 mb-2">Fehler beim Import:</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4">
                <Link
                  href="/students"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Zur Schüler-Übersicht
                </Link>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setImportResult(null);
                    setPreviewData([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Weitere Datei importieren
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
