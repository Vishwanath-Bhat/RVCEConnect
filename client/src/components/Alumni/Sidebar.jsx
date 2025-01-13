import React, { useState } from 'react';
import { useGetProfileQuery } from '../../redux/api/apiSlice';  
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user, currentUserId } = useAuth();
  const { data: alumni, isLoading, isError } = useGetProfileQuery(currentUserId);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading Profile...</p>;
  }

  if (isError || !alumni) {
    return <p>Failed to load profile.</p>;
  }

  const handleMyNetwork = () => {
    navigate('/chat');
  };

  const handleViewProfile = () => {
    navigate('/myProfile', { state: { alumni: alumni.data } }); 
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile', { state: { alumni: alumni.data } });
  };

  const handleNotifications = () => {
    navigate('/notification')
  }

  return (
    <div className="bg-gray-200 w-1/4 p-4">
      <div 
        className="text-center mb-6 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={alumni.data.profile_photo || "https://via.placeholder.com/100"} 
          alt="Profile"
          className="rounded-full mx-auto w-36 h-36 object-cover"
        />
        {isHovered && (
          <button 
            className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center rounded-full"
            onClick={handleViewProfile}
          >
            View Profile
          </button>
        )}
        <h2 className="text-lg font-bold">{alumni.data.name || "John Doe"}</h2>
        <p className="text-gray-500">{alumni.data.profession || ""}</p>
      </div>
      <ul className="space-y-4">
        <li
          className="p-2 bg-gray-300 rounded-md cursor-pointer"
          onClick={handleUpdateProfile}
        >
          📝 Update Profile
        </li>
        <li
        className="p-2 bg-gray-300 rounded-md cursor-pointer"
        onClick={handleMyNetwork} 
      >
        👥 My Network
      </li>
        <li className="p-2 bg-gray-300 rounded-md cursor-pointer" onClick={handleNotifications}>🔔 Notifications</li>
      </ul>
    </div>
  );
};

export default Sidebar;
