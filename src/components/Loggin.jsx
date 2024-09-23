// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </React.Fragment>
    );
  }

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
      setOpen(false);
    };
    const handleOpen = () => {
      setOpen(true);
    };
    
    const handleLogin = async (e) => {
        handleOpen();
        e.preventDefault();
        let errorMessage = '';
        try {
            // Fetch the IP address
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) {
                throw new Error('Failed to fetch IP address');
            }
            const ipData = await ipResponse.json();
            const ip = ipData.ip;
    
            // Make the POST request with email, password, and IP address
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    ip,
                }),
            });
    
            var data = await response.json();
    
            if (!response.ok) {
                // Handle server errors (e.g., 500)
                throw new Error(data.message || 'An error occurred during login');
            }
    
            if (data.success) {
                handleClose();
                // Store the token and update state on successful login
                setToken(data.data.token);
                localStorage.setItem('authToken', data.data.token); // Store token in localStorage
                setMessage(data.data);
            } else {
                setMessage(data.data);
            }
        } catch (error) {
            // Capture error messages and display them
            handleClose();
            setMessage(data);

        }
    };
    
    
    

    return (
<div className="w-80 md:w-[24rem] px-10 py-8 md:px-12 md:py-auto bg-white rounded-lg shadow-custom overflow-hidden font-outfit">
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <GradientCircularProgress />
      </Backdrop>
    <h2 className="text-2xl font-semibold text-center text-[#001752] mb-10">Login</h2>
    <form onSubmit={handleLogin}>
        <div>
            
            <input
                id="email"
                type="email"
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm font-outfi cursor-text"
            />
        </div>
        <div>
       
            <input
                id="password"
                type="password"
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm font-outfi  cursor-text"
            />
        </div>
        <button
            type="submit"
            className="mt-10 w-full px-4 py-2 bg-[#001752] text-white font-semibold rounded-lg shadow-md hover:bg-[#182f6a] font-outfi cursor-pointer"
        >
            Login
        </button>
    </form>
        {message && (
            <p className={`mt-4 text-center ${message.success ? 'text-green-600' : 'text-red-600'}`}>
                {message.message}
            </p>
        )}
</div>

    );
};

export default Login;
