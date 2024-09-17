import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const IPAddressManager = ({ userId, token }) => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if(token){
    fetchIpAddresses();
    fetchIpCheckStatus();
    }
  }, [token]);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/credentials'); // This will navigate to the root route
  };

  const [isChecked, setIsChecked] = useState(false); // Initial state


  // Function to fetch the current check value from the backend
  const fetchIpCheckStatus = async () => {
    try {
      const response = await fetch('http://34.226.136.144:3000/api/ip/ipcheck', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Replace token with your actual token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch IP check status');
      }

      const data = await response.json();
      setIsChecked(data.check === 1); // Set the checkbox state based on the check value
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const toggleIpCheck = async (checkValue) => {
    if (checkValue === undefined) {
      console.error('Check value is required');
      return;
    }

    try {
      const response = await fetch('http://34.226.136.144:3000/api/ip/ipcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ check: checkValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update IP check value');
      }

      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Handle the checkbox change
  const handleCheckboxChange = () => {
    const newCheckValue = isChecked ? 0 : 1;
    setIsChecked(!isChecked); // Toggle the checkbox state
    toggleIpCheck(newCheckValue); // Call the function with 0 or 1
  };
  // Fetch IP addresses from the server
  const fetchIpAddresses = async () => {
    try {
      const response = await fetch(`http://34.226.136.144:3000/api/ip`, {  // Full URL for local dev
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch IP addresses');
      }
      const data = await response.json();
      setIpAddresses(data);
      setError(''); // Clear any previous error
    } catch (error) {
      setError(error.message); // Show more specific error message
    }
  };

  // Add a new IP address
  const addIpAddress = async () => {
    if (!newIpAddress) {
      setError('IP address is required');
      return;
    }

    try {
      const response = await fetch(`http://34.226.136.144:3000/api/ip`, {  // Full URL for local dev
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, ip: newIpAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to add IP address');
      }

      setNewIpAddress('');
      setError('');
      fetchIpAddresses(); // Refresh the list after adding
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete an IP address by ID
  const deleteIpAddress = async (id) => {
    try {
      const response = await fetch(`http://34.226.136.144:3000/api/ip/${id}`, {  // Correct the DELETE URL
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete IP address',response.text);
      }

      setError('');
      fetchIpAddresses(); // Refresh the list after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 flex justify-between align-middle bg-gray-100 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">IP Address Manager</h2>

        <div className='flex justify-between'>
        <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span> IP Bound Security</span>
      </label>
        <button
          className="px-4 py-2 ml-2 bg-gray-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={goToHome}
        >
          Back
        </button>
        </div>

      </div>
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newIpAddress}
            onChange={(e) => setNewIpAddress(e.target.value)}
            placeholder="Enter IP address"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addIpAddress}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add IP
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ipAddresses.map((ip) => (
              <tr key={ip.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ip.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => deleteIpAddress(ip.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='text-red-500 text-center text-sm mt-5'>
          Note: Do not enable IP-bound security if your IP address is dynamic.
        </div>
      </div>
    </div>
  );
};

export default IPAddressManager;
