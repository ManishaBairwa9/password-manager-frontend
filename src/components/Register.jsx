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
            await axios.post('http://localhost:3000/api/auth/register', {
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
    <div className="w-80 md:w-[24rem] px-10 py-8 md:px-12 md:py-auto bg-white rounded-lg shadow-custom overflow-hidden font-outfit">

        <h2 className="text-2xl font-semibold text-center text-[#001752] mb-10">Register</h2>
        
          {/* {message && (
            <div className={`mb-4 p-4 rounded-lg text-white ${message.status === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                {message.messageText}
            </div>
        )} */}
        
        <form onSubmit={handleRegister}>
            <div>
                <input
                    id="email"
                    type="email"
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm cursor-text"
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
                    className="mt-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 sm:text-sm cursor-text"
                />
            </div>
            <button
                type="submit"
                className="mt-10 w-full px-4 py-2 bg-[#001752] text-white font-semibold rounded-lg shadow-md hover:bg-[#182f6a] focus:outline-none cursor-pointer"
            >
                Sign Up
            </button>
        </form>
        {message && <p className={`mt-4 text-center ${message.status === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.messageText}</p>}

    </div>

    );
};

export default Register;
