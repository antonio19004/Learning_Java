
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation,useNavigate } from 'react-router-dom';
import '../Static/Styles/Style.css';
import NavMenu from '../Layouts/NavMenu';
import Logo from '../Static/Img/Logo-LJ.png';
import NavPanel from './NavPanel';
import NoFoundR from '../Layouts/NoFoundR';
import Document from './Document';
import UploadDocument from './UploadDocumentation';
import EditDocument from './EditDocument';
import CreateCourse from './Courses/CreateCourses';
import Courses from './Courses/Courses';
import EditCourse from './Courses/EditCourse';
import CreateLesson from './Lesson/CreateLesson';
import Lessons from './Lesson/Lessons';
import EditLessonForm from './Lesson/EditLesson';

const Panel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rol = localStorage.getItem('role');
  const location = useLocation();
  const navigate = useNavigate();

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleHashClick = (e) => {
    if (e.target.getAttribute('href') === '#') {
      e.preventDefault();
      navigate('/noroute');
    }
  };

  const formatRole = (rol) => {
    switch (rol) {
        case 'ROLE_USER':
            return 'USER';
        case 'ROLE_ADMIN':
            return 'ADMIN';
        default:
            return rol;
    }
  }

  document.title = 'Panel '+ formatRole(rol);

  const isAuthenticated = localStorage.getItem('username') !== null;

  return (
    <div>
            <NavPanel/>
            
      <div className='sidebar' id="navbarNav">
      <a href='/panel'><img src={Logo} className='NavLogo mx-5' alt='Logo...' /></a>
      <h4 className='ms-6 text-secondary'>PANEL {formatRole(rol)}</h4>
      <hr className='mx-5'></hr>
      <div onClick={handleHashClick}>
        <ul className="navbar-nav flex-column p-5">
        <span class="badge bg-dark mb-2">Parametrización</span>
          <li className="nav-item">
            <a className="nav-link text-Light" aria-current="page" href="/panel/document">Documentos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/panel/documentForm">Usuarios</a>
          </li>
          <li className="nav-item text-Light">
            <a className="nav-link text-Light" href="/panel/courses">Cursos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-Light" href="#">About</a>
          </li>
        </ul>
        <div className='pt-5'>
        <hr className='mx-5'></hr>
        <p className="sidebar-footer pt-3">© 2024 Learning Java.</p>
        </div>
        </div>
      </div>

       <div className='ps-3 shadowinset pe-5 pt-3'>
        {location.pathname === '/panel' && (
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">¡Bienvenido al Panel!</h4>
            <p>Has accedido exitosamente al panel de control. Aquí encontrarás diversas funciones y opciones de parametrización, dependiendo de tu rol como usuario o administrador.</p>
            <hr />
            <p className="mb-0">Explora las opciones disponibles y gestiona tus tareas de manera eficiente.</p>
          </div>
        )}
        <Routes>
          <Route path="/document" element={isAuthenticated ? <Document /> : <Navigate to="/login" />} />
          <Route path="/add-document" element={isAuthenticated ? <UploadDocument /> : <Navigate to="/login" />} />
          <Route path='/edit-document/:id' element={isAuthenticated ? <EditDocument/> : <Navigate to="/login" />}/>
          <Route path='/coursesForm' element={isAuthenticated ? <CreateCourse/> : <Navigate to="/login" />}/>
          <Route path='/courses' element={isAuthenticated ? <Courses/> : <Navigate to="/login" />}></Route>
          <Route path='/edit-course/:id' element={isAuthenticated ? <EditCourse/> : <Navigate to="/login" />}></Route>
          <Route path='/edit-lesson/:id' element={isAuthenticated ? <EditLessonForm/> : <Navigate to="/login" />}></Route>
          <Route path='/lessonForm/course/:id' element={isAuthenticated ? <CreateLesson/> : <Navigate to="/login" />}></Route>
          <Route path='/lessons/course/:id' element={isAuthenticated ? <Lessons/> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
    </div>
  );
};


export default Panel;
