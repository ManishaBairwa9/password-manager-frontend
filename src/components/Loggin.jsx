// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    
    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            // Fetch the IP address
            const ipResponse = await axios.get('https://api.ipify.org?format=json');
            const ip = ipResponse.data.ip;
    
            // Make the POST request with email, password, and IP address
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
                ip
            });
    
            // Store the token and update state on successful login
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token); // Store token in localStorage
            setMessage('Login successful!');
        } catch (error) {
            setMessage('Login failed.');
        }
    }
    

    return (
<div className="w-80 md:w-[24rem] px-10 py-8 md:px-12 md:py-auto bg-white rounded-lg shadow-custom overflow-hidden font-outfit">
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
                className="mt-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm font-outfi"
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
                className="mt-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm font-outfi"
            />
        </div>
        <button
            type="submit"
            className="mt-10 w-full px-4 py-2 bg-[#001752] text-white font-semibold rounded-lg shadow-md hover:bg-[#182f6a] font-outfi"
        >
            Login
        </button>
    </form>
        {message && (
            <p className={`mt-4 text-center ${message.status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {message.text}
            </p>
        )}
</div>

    );
};

export default Login;
