"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSignUp } from '@/app/_api/auth/signup'; // Import your custom hook

const SignUp = () => {
  const mutation = useSignUp();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false); // New state to differentiate between success and error

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    mutation.mutate(formData, {
      onError: (error: Error) => {
        // Set error message and show modal
        setModalMessage(`Error: ${error.message}`);
        setIsError(true);
        setShowModal(true);
      },
      onSuccess: (data) => {
        // Set success message and show modal
        setModalMessage(data.message ?? "Account created successfully!");
        setIsError(false);
        setShowModal(true);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
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
                required
                className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign In
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
            <div className='w-full flex justify-end gap-2'>
              {!isError && (
                <Link href="/sign-in">
                  <button className="p-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Go to Sign In
                  </button>
                </Link>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
