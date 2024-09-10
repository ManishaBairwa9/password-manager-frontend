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
            const response = await axios.post('http://34.226.136.144:3000/api/auth/login', {
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
<div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Login</h2>
    <form onSubmit={handleLogin} className="space-y-4">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
        </div>
        <button
            type="submit"
            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
            Login
        </button>
    </form>
    {message && <p className="mt-4 text-center text-red-600">{message}</p>}
</div>

    );
};

export default Login;
