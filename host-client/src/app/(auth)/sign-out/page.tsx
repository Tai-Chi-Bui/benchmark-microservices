"use client"
import useLogout from '@/app/_hooks/useLogout';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SignOut: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Display the modal
    setShowModal(true);
    useLogout();
    
    // Call the logout function after a slight delay to show the modal
    const timer = setTimeout(() => {
        router.push('/sign-in');
    }, 1000); // Adjust the timeout duration as needed

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded shadow-md flex flex-col items-center space-y-4">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
            </div>
            <h2 className="text-lg font-medium text-gray-700">Signing out...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOut;
