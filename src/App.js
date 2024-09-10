// src/App.js
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Loggin';
import Credentials from './components/Credentials';
import IPAddressManager from './components/ipAddress';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    useEffect(() => {
        setToken(localStorage.getItem('authToken'));
    }, []);

    return (
        <Router>
            <Routes>
            <Route path="/" element={
                 <div>
                 {!token ? (
                     <>
                         <Register />
                         <Login setToken={setToken} />
                     </>
                 ) : (
                     <>
                         <Credentials token={token} />
                     </>
                 )}
             </div>
            } />
            <Route path="/ip" element={<IPAddressManager token={token}/>} />
        </Routes>
        </Router>
    );
};

export default App;