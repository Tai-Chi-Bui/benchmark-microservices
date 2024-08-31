// components/layout.tsx

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { HomeIcon, BookOpenIcon, ArrowDownOnSquareIcon, ArrowUpOnSquareIcon, CubeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { cookies } from 'next/headers'; // Import cookies to read server-side
import { isValidToken } from '../_utils/auth';

interface LayoutProps {
  children: ReactNode;
}

// Define a server-side function to check if the user is authenticated
const checkAuthentication = (): boolean => {
  // Retrieve the token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  // Check if the token is valid
  return isValidToken(token);
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAuthenticated = checkAuthentication(); // Check authentication status

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 text-center shadow-md">
        <h1 className="text-4xl font-bold">Microservices Project by Tai Bui</h1>
        <p className="mt-2 text-lg">A demo showcasing the power of microservices architecture</p>
      </header>

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 shadow-lg">
        <ul className="flex justify-center space-x-8">
          <li className="flex items-center space-x-2">
            <HomeIcon className="h-5 w-5" />
            <Link href="/home">
              <span className="cursor-pointer hover:text-gray-300">Home</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <BookOpenIcon className="h-5 w-5" />
            <Link href="/blogs">
              <span className="cursor-pointer hover:text-gray-300">Blogs</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <ListBulletIcon className="h-5 w-5" />
            <Link href="/products">
              <span className="cursor-pointer hover:text-gray-300">Products</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <CubeIcon className="h-5 w-5" />
            <Link href="/admin-dashboard">
              <span className="cursor-pointer hover:text-gray-300">Dashboard</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <ArrowDownOnSquareIcon className="h-5 w-5" />
                <Link href="/sign-out">
                  <span className="cursor-pointer hover:text-gray-300">Sign Out</span>
                </Link>
              </>
            ) : (

              <>
                <ArrowUpOnSquareIcon className="h-5 w-5" />
                <Link href="/sign-in">
                  <span className="cursor-pointer hover:text-gray-300">Sign In</span>
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-grow p-8 bg-white shadow-md rounded-lg m-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 text-center mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Tai Bui. All rights reserved.</p>
        <p className="text-sm">Built with ❤️ using Next.js and TypeScript</p>
      </footer>
    </div>
  );
};

export default Layout;
