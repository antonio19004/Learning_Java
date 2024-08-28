import { Route, Routes, Navigate,useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Home from './Components/Home.js';
import Profile from './Components/Profile.js';
import Forum from './Components/Forum.js';
import NewForum from './Components/NewForum.js';
import ForumDetail from './Components/ForumDetail.js';
import Contact from './Components/Contact.js';
import AboutUs from './Components/AboutUs.js';
import Login from './Security/Login';
import Register from './Security/Register.js';
import ResetPassword from './Security/ResetPassword.js';
import UpdatePassword from './Security/UpdatePassword.js';
import useIdleTimer from './Security/Inactivity.js';
import LoadingScreen from './Layouts/LoadingScreen.js';
import UploadDocument from './Components/UploadDocumentation.js';
import Document from './Components/Document.js';
import Panel from './Components/Panel.js';
import NoFoundR from './Layouts/NoFoundR.js';
import DocumentIndex from './Components/DocumentIndex.js';

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
        <Route path='/forum-topic/:id' element={isAuthenticated ? <ForumDetail /> : <Navigate to="/login" />} />
        <Route path='/new-forum' element={isAuthenticated ? <NewForum /> : <Navigate to="/login" />} />
        <Route path='/forum' element={isAuthenticated ? <Forum /> : <Navigate to="/login" />} />
        <Route path='/Document' element={isAuthenticated ? <DocumentIndex/> : <Navigate to="/login" />}/>
        <Route path='/noroute' element={<NoFoundR/>}/>
        <Route path='/panel/*' element={<Panel/>}/>
        <Route path='/profile' element={<Profile />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/update-password' element={isAuthenticated ? <UpdatePassword /> : <Navigate to="/login" />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={isAuthenticated ? <Home/> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/documentForm' element={isAuthenticated ? <UploadDocument/> : <Navigate to='/login'/>}/>
        <Route path="*" element={<NoFoundR/>} />
    </Routes>
  );
}

export default App;
