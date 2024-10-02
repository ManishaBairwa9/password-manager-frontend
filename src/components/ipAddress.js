import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaMoon, FaSun, } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { ReactComponent as UserIcon } from "../usericon.svg";

const IPAddressManager = ({ userId, token }) => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false); 
  const [darkMode, setDarkMode] = useState(false);
  
  const handleLogout = () => {
    navigate("/");
    window.location.reload();
    localStorage.removeItem("authToken"); // Remove token from localStorage
  };

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  const handleToggle = () => {
    setDarkMode((prevState) => !prevState);
  };

  const goToCredentails = () => {
    navigate("/credentials");
    window.location.reload();
  }

  useEffect(() => {
    if(token){
    fetchIpAddresses();
    fetchIpCheckStatus();
    }else{
      navigate("/");
    }
  }, [token]);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate(''); // This will navigate to the root route
  };

  const [isChecked, setIsChecked] = useState(false); // Initial state


  // Function to fetch the current check value from the backend
  const fetchIpCheckStatus = async () => {
    try {
      const response = await fetch('http://3.86.112.165:3000/api/ip/ipcheck', {
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
      setIsChecked(data.data.check === 1); // Set the checkbox state based on the check value
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
      const response = await fetch('http://3.86.112.165:3000/api/ip/ipcheck', {
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
      const response = await fetch(`http://3.86.112.165:3000/api/ip`, {  // Full URL for local dev
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch IP addresses');
      }
      const data = await response.json();
      setIpAddresses(data.data);
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
      const response = await fetch(`http://3.86.112.165:3000/api/ip`, {  // Full URL for local dev
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
      const response = await fetch(`http://3.86.112.165:3000/api/ip/${id}`, {  // Correct the DELETE URL
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
    <>
    <div className="backdrop-blur-lg flex justify-between items-center h-16 px-6 md:h-16 md:px-16 lg:h-20 lg:px-24 fixed top-0 w-screen z-50">
        <div className="w-[40px] h-[44px] bg-logo bg-cover"></div>

        <div className="flex items-center gap-2 md:gap-8 justify-center">
          {darkMode && (
            <button onClick={handleToggle} title="dark theme">
              <FaMoon className="text-white" size={26} />
            </button>
          )}
          {!darkMode && (
            <button onClick={handleToggle} title="light theme">
              <FaSun className="text-white" size={26}/>
            </button>
          )}

<div className="relative flex items-center justify-center">
            <UserIcon onClick={toggleVisibility} className="w-10" />
            {isVisible && (
              <div className="absolute top-16 flex gap-4 flex-col items-center">
                <button
                  className="rounded-full border-2 p-3 bg-white bg-opacity-10"
                  title="logout"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-white"/>
                </button>
                <button
                title="IP Manager"
                  className="rounded-full border-2 text-white px-[0.65rem] py-2 bg-white bg-opacity-10 text-nowrap"
                  onClick={goToCredentails}
                >
                  CR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  <div className="min-h-screen bg-[#00021B] px-4 md:px-32 py-2 md:py-8 text-white max-w-full overflow-x-hidden">
    <div className="max-w-6xl mx-auto shadow-md rounded-lg overflow-hidden h-full mt-20">
    <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mx-auto text-center pt-20 pb-4 md:pt-10 md:pb-16 font-outfit z-50">
          IP Manager
        </h1>
      <div className="px-6 py-4 flex justify-between align-middle  border-b ">
        <h2 className="text-xl font-semibold text-white">IP Address Manager</h2>

        <div className='flex justify-between'>
        <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 text-green-600"
        />
        <span> IP Bound Security</span>
      </label>
        <button
          className="px-4 py-2 ml-2 text-white rounded-md bg-[#00021B] hover:border-green-500 hover:border-opacity-100 border-2 border-opacity-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
            className="flex-grow px-3 py-2 border  bg-[#00021B] rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={addIpAddress}
            className="px-4 py-2 text-[#00021B] rounded-md bg-[#63e400] hover:border-green-500 hover:border-opacity-100 border-2 border-opacity-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add IP
          </button>
        </div>

        <table className="min-w-full divide-y ">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ipAddresses.map((ip) => (
              <tr key={ip.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{ip.ip}</td>
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
    </div>
    </>
  );
};

export default IPAddressManager;
