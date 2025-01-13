import React from 'react';
import { Link } from 'react-router-dom';
import  useAuth  from '../redux/hooks/useAuth'

const Navbar = () => {
    const { user, UpdateUserLogout } = useAuth()
    const handleClick = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/me/logout", {
                method: "POST",
                credentials: "include", // Ensures cookies are sent to the server
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log(result.message); // "Logged out successfully!"
            UpdateUserLogout()
        } catch (error) {
            console.error("Error during logout:", error);
        }
        
    }
    return (
        <nav className="nav-bar bg-slate-700 p-4 text-white">

            <div className=" mx-auto flex justify-between items-center">
                <Link to="/">
                    <div className="text-white flex font-bold text-xl">
                        <p className='text-green-500'></p>Rvce
                        <p className='text-green-500'>Connect</p>
                    </div>
                </Link>

                <div className="flex space-x-4">
                    {user && (
                        <div className='flex'>
                            <div className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">Hi 👋 {user}</div>
                            <button onClick={handleClick} className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">Logout</button>
                        </div>
                    )}
                    {!user && (
                    <div className='flex'>
                        <Link to="/login/user" className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">
                            Login
                        </Link>
                        <Link to="/signup" className="text-green-500 hover:text-green-300 font-semibold py-2 px-4 rounded-md transition duration-300">
                            Sign Up
                        </Link>
                    </div>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
