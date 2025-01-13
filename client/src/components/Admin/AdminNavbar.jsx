import React from 'react';
import { AiOutlineBarChart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import AdminAlumniRequests from './AdminAlumniRequests'


const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      
      <div className="text-lg font-bold">
        Admin Panel
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <AiOutlineBarChart size={24} />
          <span className="hidden md:inline">Analytics</span>
        </div>

        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <AiOutlineUsergroupAdd size={24} />
          <span className="hidden md:inline">Friend Requests</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

