import React, { useState } from "react";
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from "react-router-dom";

const UserSignup = ({ goBack }) => {
  const navigate = useNavigate();
  const { UpdateUserLogin } = useAuth();
  const [username, setUsername] = useState("Gandu");
  const [password, setPassword] = useState("Gandu@123");
  const [email, setEmail] = useState("gandu@gmail.com");
  const [department, setDepartment] = useState("CSE");
  const [admissionYear, setAdmissionYear] = useState("2000");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Create a preview URL
      setProfileImage(file)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("department", department);
      formData.append("admissionYear", admissionYear);
      formData.append("role", "user");
      formData.append("profilePhoto", profileImage);

      const response = await fetch('http://localhost:3000/api/user/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setSuccessMessage(data.message);
        setError("");
        UpdateUserLogin(data.username, data.role, data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div>
      

      {/* Form Container */}
      <div className="p-6 flex justify-center"> {/* Added space for navbar */}
        <div className="w-full max-w-md">
          <button onClick={goBack} className="text-xl mb-4">
            ← 
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">User Signup</h2>
          <div className="flex flex-col items-center mb-6">
            {/* Profile Photo */}
            <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden mb-4">
              <img
                src={profilePhoto || "https://via.placeholder.com/150"} // Default placeholder image
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="block font-semibold text-center mb-2">
              Upload Profile Photo
            </label>
            <input
              type="file"
              className="hidden"
              id="profilePhotoInput"
              onChange={handlePhotoChange}
              accept="image/*"
            />
            <button
              onClick={() => document.getElementById("profilePhotoInput").click()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Choose Photo
            </button>
          </div>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label className="block mb-2 font-semibold">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold">College Email ID</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold">Department</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            <label className="block mb-2 font-semibold">Admission Year</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
