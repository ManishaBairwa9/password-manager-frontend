import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrash, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 

const Credentials = ({ token }) => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [password, setPassword] = useState('');
    const [credentials, setCredentials] = useState([]);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (token) {
            fetchCredentials();
        }
    }, [token]);

    const navigate = useNavigate();

    const goToip = () => {
      navigate('/ip'); // This will navigate to the root route
    };
    const fetchCredentials = async () => {
        try {
            const response = await axios.get('http://34.226.136.144:3000/api/credentials', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCredentials(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching credentials:', error);
            setError('Failed to fetch credentials.');
        }
    };

    const handleAddOrUpdateCredential = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://34.226.136.144:3000/api/credentials/${editingId}`, {
                    name,
                    link,
                    password
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://34.226.136.144:3000/api/credentials', {
                    name,
                    link,
                    password
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setName('');
            setLink('');
            setPassword('');
            setEditingId(null);
            fetchCredentials();
            setError('');
        } catch (error) {
            console.error('Error adding/updating credential:', error);
            setError('Failed to add/update credential.');
        }
    };

    const handleEdit = (credential) => {
        setName(credential.name);
        setLink(credential.link);
        setPassword(credential.password);
        setEditingId(credential.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://34.226.136.144:3000/api/credentials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCredentials();
            setError('');
        } catch (error) {
            console.error('Error deleting credential:', error);
            setError('Failed to delete credential.');
        }
    };

    const getFaviconUrl = (link) => {
        try {
            const url = new URL(link);
            return `https://www.google.com/s2/favicons?domain=${url.hostname}`;
        } catch (error) {
            console.error('Invalid URL:', error);
            return null;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token from localStorage
        navigate('/');
    };

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center">
            <div className='p-2 flex gap-3 justify-end'>
        <button
        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleLogout}
        >
        Logout
        </button>
        <button
        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={goToip}
        >
        IP Manager
        </button>
            </div>
            <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0 bg-white">

                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-center text-gray-900">End-to-End Encrypted Password Manager</h1>
                            <p className="mt-2 text-center text-sm text-gray-600">Your passwords are securely encrypted and only accessible by you.</p>
                        </div>
                        
                        <div className="divide-y">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Credentials</h2>
                                <form onSubmit={handleAddOrUpdateCredential} className="space-y-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autocomplete="off"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="link" className="text-sm font-medium text-gray-700">Link</label>
                                        <input
                                            id="link"
                                            type="text"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            required
                                            autocomplete="one-time-code"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autocomplete="one-time-code"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        {editingId ? 'Update' : 'Add'}
                                    </button>
                                </form>
                            </div>
                            
                            <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                                <h2 className="text-xl font-bold mb-4">Stored Credentials</h2>
                                {error && <p className="mt-4 text-red-500">{error}</p>}
                                <div className="space-y-4">
                                    {credentials.length > 0 ? (
                                        credentials.map((credential) => (
                                            <div key={credential.id} className="bg-gray-50 shadow overflow-hidden sm:rounded-lg">
                                                <div className="px-4 py-5 sm:px-6">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={getFaviconUrl(credential.link)}
                                                            alt="Favicon"
                                                            className="w-6 h-6 mr-2"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://www.google.com/s2/favicons?domain=example.com';
                                                            }}
                                                        />
                                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{credential.name}</h3>
                                                    </div>
                                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                        <a href={credential.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">{credential.link}</a>
                                                    </p>
                                                </div>
                                                <div className="border-t border-gray-200 sm:px-4 py-5 md:px-6">
                                                    <div className="flex items-center justify-between ">
                                                        <div className="flex items-center">
                                                            <input
                                                                type={visiblePasswords[credential.id] ? 'text' : 'password'}
                                                                value={credential.password}
                                                                readOnly
                                                                className="border-none bg-transparent"
                                                            />
                                                            <button
                                                                onClick={() => togglePasswordVisibility(credential.id)}
                                                                className="ml-2 text-gray-600 hover:text-gray-900"
                                                            >
                                                                {visiblePasswords[credential.id] ? 
                                                                    <FaEyeSlash size={16} /> : 
                                                                    <FaEye size={16} />
                                                                }
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => copyToClipboard(credential.password, credential.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                                title={copiedId === credential.id ? 'Copied!' : 'Copy'}
                                                            >
                                                                <FaCopy size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(credential)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                                title="Edit"
                                                            >
                                                                <FaEdit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(credential.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete"
                                                            >
                                                                <FaTrash size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No credentials found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    );
};

export default Credentials;