// Navbar.js
import React from 'react';

const Navbar = ({ onSignupClick }) => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between">
      <div className="text-white font-bold">📅</div>
      <div className="space-x-4">
        <button
          onClick={onSignupClick} // Call the passed function on click
          className="bg-white text-blue-500 px-4 py-2 rounded"
        >
          Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
