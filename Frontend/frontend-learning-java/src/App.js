import { Route, Routes, Navigate,useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './Components/Home.js';
import Profile from './Components/Profile.js';
import Contact from './Components/Contact.js';
import Login from './Security/Login';
import Register from './Security/Register.js';
import ResetPassword from './Security/ResetPassword.js';
import UpdatePassword from './Security/UpdatePassword.js';
import useIdleTimer from './Security/Inactivity.js';
import UploadDocument from './Components/UploadDocumentation.js';
import Panel from './Components/Panel.js';
import NoFoundR from './Layouts/NoFoundR.js';
import DocumentIndex from './Components/DocumentIndex.js';
import CourseList from './Components/Courses/CourseList.js';
import CreateLesson from './Components/Lesson/CreateLesson.js';
import CreateCourse from './Components/Courses/CreateCourses.js';
import CourseView from './Components/Courses/CourseView.js';
import ViewLesson from './Components/Lesson/ViewLesson.js';



function App(){
  
  const navigate = useNavigate();


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

  useIdleTimer(43200000, handleIdle);
  const isAuthenticated = localStorage.getItem('username') !== null;


  return (
    <Routes>
      <Route path="/course/:id/lesson/:lessonIndex" element={<ViewLesson/>} />
      <Route path='/courseview/:id' element={<CourseView/>}></Route>
      <Route path='/lessonform' element={<CreateLesson/>}/>
      <Route path='/cform' element={<CreateCourse/>}/>
      <Route path='/courses' element={<CourseList/>}/>
        <Route path='/Document' element={isAuthenticated ? <DocumentIndex/> : <Navigate to="/login" />}/>
         <Route path='/noroute' element={<NoFoundR/>}/>
        <Route path='/panel/*' element={<Panel/>}/>
        <Route path='/profile' element={<Profile />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/update-password' element={<UpdatePassword />} />
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
