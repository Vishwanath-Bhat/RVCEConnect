import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../redux/hooks/useAuth';
const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { UpdateUserLogin } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                credentials: "include",

                
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, role: "user" }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }else{
                setSuccessMessage(data.message);
                // console.log(data)
                UpdateUserLogin(data.username,data.role,data.token);
                navigate("/");
              }

            
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>
                <form onSubmit={handleLogin}>
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
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" type="submit">
                        Login
                    </button>
                </form>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                
                {/* Forgot Password Link */}
                <p className="mt-4 text-center">
                    Forgot password?{" "}
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/forgot-password")}>
                        Click here
                    </span>
                </p>
                
                {/* New Member Link */}
                <p className="mt-4 text-center">
                    New Member?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>

                {/* Login as Alumni and Admin */}
                <div className="mt-6 text-center">
                    <p>Login as:</p>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 my-2"
                        onClick={() => navigate("/login/alumni")}
                    >
                        Login as Alumni
                    </button>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => navigate("/login/admin")}
                    >
                        Login as Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
