import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ViewMyProfile = () => {
  const location = useLocation();
  const { alumni } = location.state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      {/* Main Profile Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <img
          src={alumni.profile_photo || "https://via.placeholder.com/100"}
          alt="Profile"
          className="rounded-full w-24 mx-auto mb-4 cursor-pointer"
          onClick={openModal} // Open modal on image click
        />
        <h2 className="text-center text-xl font-bold">{alumni.name}</h2>
        <p className="text-center text-gray-500">{alumni.address || "Profession not specified"}</p>
        <div className="mt-4">
          <p><strong>Company:</strong> {alumni.company_name}</p>
          <p><strong>Location:</strong> {alumni.company_location}</p>
          <p><strong>Graduation Year:</strong> {alumni.graduationYear}</p>
          <p><strong>Email:</strong> {alumni.email}</p>
        </div>
      </div>

      {/* Image Popup Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the modal
          >
            <img
              src={alumni.profile_photo || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-96 h-96"
            />
            <button
              onClick={closeModal}
              className="absolute  top-4 right-4 text-white bg-gray-800 p-2 rounded-full"
            >
              <span className='top-6'>x</span>
            </button>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">Posts</h3>
        <p>No posts available yet.</p>
      </div>
    </div>
  );
};

export default ViewMyProfile;
