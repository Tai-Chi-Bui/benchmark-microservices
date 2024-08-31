"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useLogin } from '@/app/_api/auth/login';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const mutation = useLogin();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [countdown, setCountdown] = useState(2); // State for countdown timer

  useEffect(() => {
    if (showModal && !isError) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            router.push('/home');
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showModal, isError, router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    formData.append('rememberMe', String(rememberMe));

    mutation.mutate(formData, {
      onError: (error: Error) => {
        setModalMessage(`Error: ${error.message}`);
        setIsError(true);
        setShowModal(true);
      },
      onSuccess: (data) => {
        const expires = rememberMe ? 30 : 1;
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + expires);

        // Check if running on HTTPS to set the secure attribute
        const secure = window.location.protocol === 'https:' ? 'secure;' : '';

        document.cookie = `authToken=${data.token}; expires=${expiresDate.toUTCString()}; path=/; ${secure} samesite=strict`;


        setModalMessage(data.message ?? "Log in successfully!");
        setIsError(false);
        setShowModal(true);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link href={'/forgot-password'} className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
          <div className="text-sm text-center">
            <p className="text-gray-600">
              You don't have an account?{' '}
              <Link href={'/sign-up'} className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className={`text-2xl font-medium mb-8 ${isError ? 'text-red-600' : 'text-blue-900'}`}>
              {modalMessage}
            </h3>
            {!isError && (
              <p className="text-center text-gray-700">
                Redirecting in {countdown} second{countdown > 1 ? 's' : ''}...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
