import { Route, Routes, Navigate,useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Register from './Security/Register.js';
import Login from './Security/Login';
import Home from './Components/Home.js';
import useIdleTimer from './Security/Inactivity.js';
import LoadingScreen from './Layouts/LoadingScreen.js';



function App(){
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleIdle = () => {
    fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      navigate('/login');
    });
  };

  useIdleTimer(600000, handleIdle);
  const isAuthenticated = localStorage.getItem('username') !== null;


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
            <Routes>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />} />
                <Route path="/Home" element={isAuthenticated ? <Home/> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
  );
}


export default App;
