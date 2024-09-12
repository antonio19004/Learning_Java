import { Route, Routes, Navigate,useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './Components/Home.js';
import Profile from './Components/Profile.js';
import Forum from './Components/Forum/Forum.js';
import NewForum from './Components/Forum/NewForum.js';
import ForumDetail from './Components/Forum/ForumDetail.js';
import Contact from './Components/Contact.js';
import AboutUs from './Components/AboutUs.js';
import Login from './Security/Login';
import Register from './Security/Register.js';
import ResetPassword from './Security/ResetPassword.js';
import UpdatePassword from './Security/UpdatePassword.js';
import useIdleTimer from './Security/Inactivity.js';
import UploadDocument from './Components/Document/UploadDocumentation.js';
import Panel from './Components/Panel.js';
import NoFoundR from './Layouts/NoFoundR.js';
import DocumentIndex from './Components/Document/DocumentIndex.js';
import CourseList from './Components/Courses/CourseList.js';
import CreateLesson from './Components/Lesson/CreateLesson.js';
import CreateCourse from './Components/Courses/CreateCourses.js';
import CourseView from './Components/Courses/CourseView.js';
import ViewLesson from './Components/Lesson/ViewLesson.js';
import ExercisesList from './Components/Exercise/ListExercise.js';

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
      <Route path="/exercises" element={<ExercisesList/>} />
      <Route path='/forum-topic/:id' element={isAuthenticated ? <ForumDetail /> : <Navigate to="/login" />} />
      <Route path='/new-forum' element={isAuthenticated ? <NewForum /> : <Navigate to="/login" />} />
      <Route path='/forum' element={isAuthenticated ? <Forum /> : <Navigate to="/login" />} />
      <Route path="/course/:id/lesson/:lessonIndex" element={<ViewLesson/>} />
      <Route path='/courseview/:id' element={<CourseView/>}></Route>
      <Route path='/lessonform' element={<CreateLesson/>}/>
      <Route path='/cform' element={<CreateCourse/>}/>
      <Route path='/courses' element={<CourseList/>}/>
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
      <Route path="/Home" element={<Home />} />
      <Route path="/" element={<Navigate to="/Home" />} />
      <Route path='/documentForm' element={isAuthenticated ? <UploadDocument/> : <Navigate to='/login'/>}/>
      <Route path="*" element={<NoFoundR/>} />  
    </Routes>
  );
}

export default App;
