import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the component to avoid SSR issues
const StudentsImportComponent = dynamic(() => import('../../components/StudentsImport'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
});

export default function StudentsImport() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <StudentsImportComponent />
    </Suspense>
  );
}