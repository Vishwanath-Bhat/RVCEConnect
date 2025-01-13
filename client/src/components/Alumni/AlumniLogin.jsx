import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../redux/hooks/useAuth';
import checkRequestStatus from "../../utils/checkRequestStatus";

const AlumniLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { UpdateUserLogin } = useAuth();


    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            // Check the request status
            const statusData = await checkRequestStatus(username);
    
            if (statusData?.isPending) {
                alert('Your request is still being processed.');
                navigate("/pending-approval");
            }else if (statusData?.isRejected) {
                try {
                    const response = await fetch("http://localhost:3000/api/alumni/removeAlumni", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username }),
                    });
            
                    const result = await response.json();
            
                    if (response.ok) {
                        alert(`Your request was rejected and removed Try Signing in Again. Reason: ${statusData.reason || 'No reason provided.'}`);
                        navigate("/signup");
                    } else {
                        alert(`Failed to remove rejected request: ${result.message || 'Unknown error occurred.'}`);
                    }
                } catch (error) {
                    console.error('Error removing rejected alumni:', error);
                    // alert('An error occurred while removing your rejected request. Please try again.');
                }
            } else {
                // Proceed with login if the request is approved
                try {
                    const response = await fetch("http://localhost:3000/api/alumni/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include", // Include credentials for session handling
                        body: JSON.stringify({ username, password, role: "alumni" }),
                    });
    
                    const loginData = await response.json();
    
                    if (response.ok) {
                        UpdateUserLogin(loginData.username, loginData.role, loginData.token, loginData.id);
                        setMessage("Login successful! You can now access your dashboard.");
                        setUsername("");
                        setPassword("");
                        navigate("/alumniDashboard");
                    } else {
                        setMessage(loginData.message || "Login failed. Please try again.");
                    }
                } catch (loginError) {
                    setMessage(loginError.message || "An error occurred during login.");
                }
            }
        } catch (statusError) {
            console.error('Error checking request status:', statusError);
            alert("An error occurred while checking your request status. Please try again.");
        }
    };
    
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Alumni Login</h2>
                <form onSubmit={handleLogin}>
                    <label className="block mb-2 font-semibold">Username</label>
                    <input
                        type="test"
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
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" type="submit">
                        Login
                    </button>
                </form>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                <p className="mt-4 text-center">
                    Forgot password?{" "}
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/forgot-password")}>
                        Click here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AlumniLogin;
