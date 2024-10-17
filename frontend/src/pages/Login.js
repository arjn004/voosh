import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import Navbar from './Navbar';

const Login = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  // Email/Password login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/home'); // Navigate to home page on successful login
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Google login success handler
  const handleGoogleSuccess = async (response) => {
    try {
      const result = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
        credentials: 'include',
      });

      const data = await result.json();
      if (result.ok) {
        navigate('/home'); // Successful Google login, navigate to home
      } else {
        setError(data.error || 'Google login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Google login failure handler
  const handleGoogleFailure = (error) => {
    setError('Google login failed');
  };

  // Redirect to signup
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        <Navbar onSignupClick={handleSignupRedirect} />
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-blue-600 text-2xl font-bold text-center mb-6">Login</h2>
            
            {/* Display error messages */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            {/* Email/Password Form */}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>

            {/* OR Separator */}
            <div className="flex items-center justify-center my-4">
              <span className="border-t border-gray-300 flex-grow"></span>
              <span className="mx-4 text-gray-500">OR</span>
              <span className="border-t border-gray-300 flex-grow"></span>
            </div>

            {/* Google Login Button */}
            <div className="text-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                buttonText="Continue with Google"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
