import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API requests

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear user authentication tokens from localStorage or sessionStorage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Notify the backend to clear the cookie token
      await axios.post('http://localhost:5000/api/auth/logout'); // Make sure your backend handles this route to clear the cookie

      // Redirect the user to the login page after logout
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between">
      <div className="text-white text-xl font-bold">📅</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
