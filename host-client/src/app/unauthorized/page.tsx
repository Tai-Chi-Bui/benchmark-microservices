import Link from 'next/link';
import React from 'react';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-lg text-gray-700 mb-6">You do not have permission to visit this page.</p>
        <Link href="/" className="text-blue-500 underline hover:text-blue-700">Go back to Home</Link>
      </div>
    </div>
  );
};

export default Unauthorized;
