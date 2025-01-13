import React, { useState, useRef } from "react";
import useAuth from '../../redux/hooks/useAuth';
import { useNavigate } from "react-router-dom";

const AlumniSignup = ({ goBack }) => {
    const [username, setUsername] = useState("Gaju");
    const [password, setPassword] = useState("Gaju@123");
    const [name, setName] = useState("Anil");
    const [email, setEmail] = useState("gaju@gmail.com");
    const [graduationYear, setGraduationYear] = useState("6790");
    const [companyName, setCompanyName] = useState("TikTok");
    const [companyLocation, setCompanyLocation] = useState("China");
    const [address, setAddress] = useState("Web Devloper");
    const [document, setDocument] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    
    // Refs for file inputs
    const profilePhotoInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const { UpdateUserLogin } = useAuth();
    const navigate = useNavigate();

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocument(file);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file)); // Create a preview URL
            setProfileImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!document) {
            setMessage("Please upload a graduation document.");
            return;
        }

        if (!profileImage) {
            setMessage("Please upload a profile photo.");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("graduationYear", graduationYear);
        formData.append("companyName", companyName);
        formData.append("companyLocation", companyLocation);
        formData.append("address", address);
        formData.append("document", document);
        formData.append("profilePhoto", profileImage);

        try {
            const response = await fetch("http://localhost:3000/api/alumni/signup", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setMessage("Signup successful! You can now log in.");
                setUsername("");
                setPassword("");
                setName("");
                setEmail("");
                setGraduationYear("");
                setCompanyName("");
                setCompanyLocation("");
                setAddress("");
                setDocument(null);
                setProfilePhoto(null);
                navigate("/pending-approval");
            } else {
                setMessage(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div>
            <button onClick={goBack} className="absolute top-4 left-4 text-xl">
                ←
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Alumni Signup</h2>
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
                    ref={profilePhotoInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                />
                <button
                    type="button" // Ensure it doesn't trigger form submission
                    onClick={() => profilePhotoInputRef.current.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Choose Photo
                </button>
            </div>

            <form onSubmit={handleSubmit}>
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
                <label className="block mb-2 font-semibold">Name</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label className="block mb-2 font-semibold">Email</label>
                <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="block mb-2 font-semibold">Graduation Year</label>
                <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    required
                />
                {/* New Fields */}
                <label className="block mb-2 font-semibold">Company Name</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <label className="block mb-2 font-semibold">Company Location</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                />
                <label className="block mb-2 font-semibold">Profession</label>
                <textarea
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                {/* Graduation Document Upload */}
                <label className="block mb-2 font-semibold">Upload Graduation Document</label>
                <input
                    type="file"
                    className="w-full mb-4"
                    ref={documentInputRef}
                    onChange={handleDocumentChange}
                    required
                />
                {message && <p className="text-red-500">{message}</p>}
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default AlumniSignup;
