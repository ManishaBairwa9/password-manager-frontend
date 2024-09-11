// src/App.js
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Loggin';
import Credentials from './components/Credentials';
import IPAddressManager from './components/ipAddress';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isRegistered, setIsRegistered] = useState(true); // New state for registration status
    useEffect(() => {
        setToken(localStorage.getItem('authToken'));
    }, []);

    let loginText = "Not registered yet?"
    let registerText = "Already have an account?"

    const handleSuccessfulRegistration = () => {
        setIsRegistered(!isRegistered); // Mark user as registered
    };

    return (
        <Router>
            <Routes>
            <Route path="/" element={
                <div className='min-h-screen p-2 md:p-14 lg:p-20 pt-28 bg-custom-pattern bg-center flex flex-col justify-center items-center'>
                <div className='absolute w-[45px] h-[49px] bg-logo bg-cover top-8 left-28'></div>
                {/* <div className='absolute w-[25rem] h-[20rem] rounded-full bg-[#63E400] opacity-10 top- left-[7rem]'></div> */}
                {isRegistered && <h1 className='text-xl sm:text-2xl md:text-3xl text-[#001752] font-medium w-full sm:w-4/5 md:w-3/4 lg:w-[40rem] mx-auto text-center py-4 font-outfit z-50'>Encrypted. Secured. Unbreakable. Your Passwords, Always Safe</h1>}
                {!isRegistered && <h1 className='text-xl sm:text-2xl md:text-3xl text-[#001752] font-medium w-full sm:w-4/5 md:w-3/4 lg:w-[40rem] mx-auto text-center py-4 font-outfit z-50'>Encrypted. Secured. Unbreakable. Your Passwords, Always Safe</h1>}
                 <div className='mx-auto w-fit flex flex-col md:flex-row gap-10 justify-center items-center mt-14 z-50'>
                    
                 {!token ? (
                     <>
                         {!isRegistered ? (
                                        <Register />
                                    ) : (
                                        <Login setToken={setToken} />
                                    )}
                     </>

                 ) : (
                     <>
                         <Credentials token={token} />
                     </>
                 )}  
             </div>
             
                <button onClick={handleSuccessfulRegistration} className='font-bold text-sky-800 pt-6'>
                    {isRegistered ? loginText : registerText}
                </button>
                  
             </div>
            } />
            <Route path="/ip" element={<IPAddressManager token={token}/>} />
        </Routes>
        </Router>
    );
};

export default App;