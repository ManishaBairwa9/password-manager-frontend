// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null); // Initialize with null

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            // Fetch the IP address
            const ipResponse = await axios.get('https://api.ipify.org?format=json');
            const ip = ipResponse.data.ip;
    
            // Make the POST request with email, password, and IP address
            await axios.post('http://34.226.136.144:3000/api/auth/register', {
                email,
                password,
                ip
            });
    
            // Update message state on successful registration
            setMessage({
                status: 'success',
                messageText: 'Registration Successful'
            });
        } catch (error) {
            // Update message state on registration failure
            setMessage({
                status: 'error',
                messageText: 'Registration Failed'
            });
        }
    }
    

    return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Register</h2>
        
        {message && (
            <div className={`mb-4 p-4 rounded-lg text-white ${message.status === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                {message.messageText}
            </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Register
            </button>
        </form>
    </div>

    );
};

export default Register;
