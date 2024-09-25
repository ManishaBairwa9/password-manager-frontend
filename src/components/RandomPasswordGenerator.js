import React, { useState, useEffect } from 'react';

const RandomPasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [ctrlPressCount, setCtrlPressCount] = useState(0);
  const [length, setLength] = useState(12);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);

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
         <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:right-0 lg:translate-x-0 md:relative md:left-auto md:right-0 md:translate-x-0">
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
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
