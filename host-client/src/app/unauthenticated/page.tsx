import React from 'react';
import Link from 'next/link';

const Unauthenticated: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthenticated</h1>
        <p className="text-lg text-gray-700 mb-6">You need to login to view this page.</p>
        <Link href="/sign-in">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200">
            Go to Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthenticated;
