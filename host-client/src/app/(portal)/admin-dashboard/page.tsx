import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-orange-100 text-orange-900 shadow-md">
        <div className="p-6 font-bold text-lg border-b border-orange-200">Admin Dashboard</div>
        <nav className="mt-6">
          <ul>
            <li className="p-4 hover:bg-orange-200 cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-orange-200 cursor-pointer">Users</li>
            <li className="p-4 hover:bg-orange-200 cursor-pointer">Settings</li>
            <li className="p-4 hover:bg-orange-200 cursor-pointer">Reports</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-orange-50">
        {/* Header */}
        <header className="h-16 bg-orange-200 shadow-md flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-orange-900">Welcome, Admin!</h1>
          <button className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500">Logout</button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Cards */}
            <div className="bg-white shadow-md rounded-md p-6 border-l-4 border-orange-500">
              <h2 className="text-lg font-semibold mb-2">Users</h2>
              <p className="text-gray-600">Total: 102</p>
            </div>
            <div className="bg-white shadow-md rounded-md p-6 border-l-4 border-orange-500">
              <h2 className="text-lg font-semibold mb-2">Active Sessions</h2>
              <p className="text-gray-600">Current: 25</p>
            </div>
            <div className="bg-white shadow-md rounded-md p-6 border-l-4 border-orange-500">
              <h2 className="text-lg font-semibold mb-2">Reports</h2>
              <p className="text-gray-600">Pending: 5</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
