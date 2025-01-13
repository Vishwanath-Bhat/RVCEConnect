import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAddInfoQuery, useUpdateAddInfoMutation, useUpdateProfileDetailsMutation } from "../../redux/api/apiSlice";

const UpdateProfile = () => {
  const location = useLocation();
  const { alumni } = location.state;
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(alumni.profile_photo);
  const [profileImage, setProfileImage] = useState(null);
  const { data, isLoading, isError } = useGetAddInfoQuery(alumni.id);

  const profilePhotoInputRef = useRef(null);

  const [updateAddInfo] = useUpdateAddInfoMutation();
  const [updateProfileDetails] = useUpdateProfileDetailsMutation();

  const [formData, setFormData] = useState({
    name: alumni.name || "",
    email: alumni.email || "",
    company_name: alumni.company_name || "",
    company_location: alumni.company_location || "",
    address: alumni.address || "",
    graduationYear: alumni.graduationYear || "",
    hobbies: "",
    about: "",
    profile_photo: null,
  });

  useEffect(() => {
    if (data && data.data) {
      setFormData(prevState => ({
        ...prevState,
        hobbies: data.data.hobbies || "",
        about: data.data.about || "",
      }));
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading....</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Update profile photo preview
      setProfileImage(file); // Set the selected image for upload
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append("username", alumni.username);
    profileData.append("name", formData.name);
    profileData.append("email", formData.email);
    profileData.append("companyName", formData.company_name);
    profileData.append("companyLocation", formData.company_location);
    profileData.append("address", formData.address);
    profileData.append("graduationYear", formData.graduationYear);
    if (profileImage) {
        profileData.append("profile_photo", profileImage); // profile photo added here
      }
    // console.log(profileData)
    for (let pair of profileData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
    const additionalInfoData = {
        
      hobbies: formData.hobbies,
      about: formData.about,
    };

    try {
        await updateProfileDetails(profileData).unwrap();
      await updateAddInfo({ alumni_id: alumni.id, hobbies: additionalInfoData.hobbies, about: additionalInfoData.about }).unwrap();
      navigate("/alumniDashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Back
      </button>

      {/* Profile Photo Display */}
      <div className="mb-4 text-center">
        <label htmlFor="profilePhotoInput" className="cursor-pointer">
          <img
            src={profilePhoto || "https://via.placeholder.com/150"} // Default placeholder
            alt="Profile"
            className="rounded-full w-36 h-36 mx-auto object-cover border-2 border-gray-300"
          />
          <h3>Update Profile Photo</h3>
        </label>
        <input
          id="profilePhotoInput"
          type="file"
          name="profile_photo"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-100 p-4 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-1 font-bold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Company Location</label>
          <input
            type="text"
            name="company_location"
            value={formData.company_location}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Profession</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Graduation Year</label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Hobbies</label>
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">About</label>
          <input
            type="text"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
