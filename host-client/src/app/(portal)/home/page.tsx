import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-gray-700">This is a Public Route</h1>
        <p className="text-md mb-6">
          A public route is accessible to everyone without any authentication or authorization requirements. 
          It allows users to view the content freely without needing to log in.
        </p>
        <div className="bg-gray-700 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-800 transition duration-300">
          <p>Enjoy exploring!</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
