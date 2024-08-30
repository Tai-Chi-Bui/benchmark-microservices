import React from 'react';

function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-gray-700">This is a Protected Route</h1>
        <p className="text-md mb-6">
          A protected route requires authentication before access is granted. It ensures that only authorized users can view the content, 
          providing a layer of security and privacy for sensitive or personalized information.
        </p>
        <div className="bg-gray-700 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-800 transition duration-300">
          <p>Access Restricted</p>
        </div>
      </div>
    </div>
  );
}

export default BlogsPage;
