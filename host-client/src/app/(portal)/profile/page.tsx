import React from 'react';

interface UserProfile {
  username: string;
  fullName: string;
  role: 'user' | 'admin';
}

const mockUserData: UserProfile = {
  username: 'johnDoe123',
  fullName: 'John Doe',
  role: 'user',
};

function Profile() {
  const { username, fullName, role } = mockUserData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-lg w-full transform transition hover:scale-105 duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">User Profile</h1>
        <div className="text-lg mb-8 flex flex-col gap-4 text-gray-700">
          <div className="flex items-center justify-center">
            <span className="font-semibold text-xl">Username:</span>
            <p className="ml-2">{username}</p>
          </div>
          <div className="flex items-center justify-center">
            <span className="font-semibold text-xl">Full Name:</span>
            <p className="ml-2">{fullName}</p>
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
