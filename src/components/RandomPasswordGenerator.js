import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaUserCog } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { ReactComponent as UserIcon } from "../usericon.svg";
import { useNavigate } from "react-router-dom";

const RandomPasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [ctrlPressCount, setCtrlPressCount] = useState(0);
  const [length, setLength] = useState(12);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false); 
  // Function to generate a random password
      const generatePassword = () => {
        const specialChars = '!@#$%^&*()';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
    

        let chars = '';
        if (includeLowercase) chars += lowercaseChars;
        if (includeUppercase) chars += uppercaseChars;
        if (includeNumbers) chars += numberChars;
        if (includeSpecial) chars += specialChars;

        if (chars.length === 0) return ''; // Return empty if no character types are selected

        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

  const handleToggle = () => {
    setDarkMode((prevState) => !prevState);
  };
  const goToip = () => {
    navigate("/ip"); // This will navigate to the root route
  };

  const goToGeneratePassword = () => {
    navigate("/generatepassword");
  }
  const handleLogout = () => {
    navigate("/");
    window.location.reload();
    localStorage.removeItem("authToken"); // Remove token from localStorage
  };

 const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Password copied to clipboard!');
    }, (err) => {
      console.error('Failed to copy: ', err);
    });
  };

  // Keydown event listener to detect "Ctrl + Ctrl" press
  useEffect(() => {
    let ctrlTimeout;

    const handleKeyDown = (event) => {
      if (event.key === 'Control') {
        setCtrlPressCount((prevCount) => prevCount + 1);

        // If Ctrl is pressed twice within 500ms
        if (ctrlPressCount === 1) {
          const newPassword = generatePassword();
          setPassword(newPassword);
          copyToClipboard(newPassword);
          setCtrlPressCount(0); // Reset the count after copying the password
        }

        // Reset count after 500ms if Ctrl is not pressed again
        clearTimeout(ctrlTimeout);
        ctrlTimeout = setTimeout(() => setCtrlPressCount(0), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(ctrlTimeout);
    };
  }, [ctrlPressCount]);

  return (
    <>
          <div className="backdrop-blur-lg flex justify-between items-center h-16 px-6 md:h-16 md:px-16 lg:h-20 lg:px-24 fixed top-0 w-screen z-50 pt-10 pb-8">
        <div className="w-[40px] h-[44px] bg-logo bg-cover"></div>

        <div className="flex items-center gap-4 md:gap-4 lg:gap-6 justify-center">
          <div className="hidden lg:inline-block">
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
          </div>
          <div className="relative flex items-center justify-center">
            <UserIcon onClick={toggleVisibility} className="w-10 cursor-pointer" />
            {isVisible && (
              <div className="absolute top-16 flex gap-2 flex-col items-center">
                <button
                  className="rounded-full border-2  border-gray-700 hover:border-gray-600 px-4 py-2 bg-white text-white bg-opacity-5 hover:scale-110 transition-transform duration-600 ease-in-out text-nowrap w-32"
                  title="Your Account"
                >
                  <FaUserCog className="text-white inline mr-1" size={20}/> Account
                </button>
                <button
                title="IP Manager"
                  className="rounded-full border-2 text-lg text-white border-gray-700 hover:border-gray-600  px-4 py-2 bg-[#0D0F27] text-nowrap hover:scale-110 transition-transform duration-600 ease-in-out w-32"
                  onClick={goToip}
                >
                  IP Manager
                </button>
                <button
                title="Generate Password"
                  className="rounded-full border-2 text-lg text-white border-gray-700 hover:border-gray-600  px-4 py-2 bg-[#0D0F27] text-nowrap hover:scale-110 transition-transform duration-600 ease-in-out w-32"
                  onClick={goToGeneratePassword}
                >
                  Generate
                </button>
                <button
                  className="rounded-full border-2  border-gray-700 hover:border-gray-600 p-3 text-white bg-white bg-opacity-5 hover:scale-110 transition-transform duration-600 ease-in-out w-32"
                  title="Logout"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-white inline mr-1" size={20}/> Logout
                </button>

              </div>
            )}
          </div>
        </div>
          
        </div>

    <div className="flex flex-col bg-[#00021B] items-center justify-center h-screen ">
      <div className= "p-6  shadow-lg w-96 !bg-[#0D0F27] backdrop-blur-2xl border-slate-500 border-2 border-opacity-25 outline-none rounded-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Random Password Generator</h2>
        <p className="text-center text-white mb-4">
          Press <strong className='text-[#63E400]'>Ctrl + Ctrl</strong> to generate and copy a password to clipboard.
        </p>
        
        <div className="mb-4">
          <label className="block mb-2 text-white">Password Length:</label>
          <input 
            type="number" 
            value={length} 
            onChange={(e) => setLength(Math.max(1, Math.min(20, e.target.value)))}
            className="border bg-transparent text-white rounded px-2 py-1 w-full"
          />
        </div>

        <div className="mb-4 text-white">
          <label className="block mb-2 text-white">Character Types:</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={includeLowercase} 
                onChange={() => setIncludeLowercase(!includeLowercase)} 
                className="mr-2" 
              />
              Include Lowercase Letters
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={includeUppercase} 
                onChange={() => setIncludeUppercase(!includeUppercase)} 
                className="mr-2" 
              />
              Include Uppercase Letters
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={includeNumbers} 
                onChange={() => setIncludeNumbers(!includeNumbers)} 
                className="mr-2" 
              />
              Include Numbers
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={includeSpecial} 
                onChange={() => setIncludeSpecial(!includeSpecial)} 
                className="mr-2" 
              />
              Include Special Characters
            </label>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <span className="text-xl font-mono text-white">{password || 'Your password will appear here'}</span>
        </div>
        <div className='flex justify-center'>
        <button
          onClick={() => {
            const newPassword = generatePassword();
            setPassword(newPassword);
            copyToClipboard(newPassword);
          }}
          className="hover:!bg-[#1c6307] !bg-[#409400] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          Generate Password Manually
        </button>
        </div>

      </div>
    </div>
    </>
  );
};

export default RandomPasswordGenerator;
