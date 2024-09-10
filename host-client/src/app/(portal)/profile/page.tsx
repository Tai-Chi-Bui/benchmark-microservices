'use client'
import { useGetUserProfile } from '@/app/_api/auth/getProfile';
import React from 'react';

function Profile() {
  // Fetch the profile data using the custom hook
  const { data: profile, error, isLoading } = useGetUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-500">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-500">
        <p className="text-white text-2xl">Error: {error.message}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-500">
        <p className="text-white text-2xl">No profile data found</p>
      </div>
    );
  }

  const { username, role } = profile;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-500 text-white">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-lg w-full transform transition hover:scale-105 duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">User Profile</h1>
        <div className="text-lg mb-8 flex flex-col gap-4 text-gray-700">
          <div className="flex items-center justify-center">
            <span className="font-semibold text-xl">Username:</span>
            <p className="ml-2">{username}</p>
          </div>
          <div className="flex items-center justify-center">
            <span className="font-semibold text-xl">Role:</span>
            <p className={`ml-2 capitalize ${role === 'admin' ? 'text-green-500' : 'text-blue-500'}`}>
              {role}
            </p>
          </div>
        </div>
        <button
          className="mt-6 px-6 py-2 rounded-md bg-gray-400 text-white font-bold cursor-not-allowed"
          disabled
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
