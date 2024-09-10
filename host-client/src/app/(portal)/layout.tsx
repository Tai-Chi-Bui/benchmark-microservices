import React, { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  CubeIcon,
  ListBulletIcon,
  ShoppingCartIcon,
  UserIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { cookies } from 'next/headers';
import { isValidToken } from '../_utils/auth';

interface LayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
}

const checkAuthentication = (): boolean => {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  return isValidToken(token);
};

// Reusable NavItem component to avoid repetition
const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => (
  <li className="flex items-center space-x-2">
    {icon}
    <Link href={href}>
      <span className="cursor-pointer hover:text-gray-300">{label}</span>
    </Link>
  </li>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAuthenticated = useMemo(() => checkAuthentication(), []);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 text-center shadow-md">
        <h1 className="text-4xl font-bold">Microservices Project by Tai Bui</h1>
        <p className="mt-2 text-lg">A demo showcasing the power of microservices architecture</p>
      </header>

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 shadow-lg sticky top-0 z-10">
        <ul className="flex justify-center space-x-8">
          <NavItem href="/home" icon={<HomeIcon className="h-5 w-5" />} label="Home" />
          <NavItem href="/products" icon={<ListBulletIcon className="h-5 w-5" />} label="Products" />
          <NavItem href="/cart" icon={<ShoppingCartIcon className="h-5 w-5" />} label="Cart" />
          <NavItem href="/orders" icon={<ClipboardDocumentIcon className="h-5 w-5" />} label="Orders" />
          <NavItem href="/admin-dashboard" icon={<CubeIcon className="h-5 w-5" />} label="Dashboard" />
          <NavItem href="/profile" icon={<UserIcon className="h-5 w-5" />} label="Profile" />
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
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 text-center mt-auto">
        <p className="text-sm">&copy; {currentYear} Tai Bui. All rights reserved.</p>
        <p className="text-sm">Built with ❤️ using Next.js and TypeScript</p>
      </footer>
    </div>
  );
};

export default Layout;
