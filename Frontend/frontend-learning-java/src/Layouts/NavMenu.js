import { useNavigate, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import Logo from '../Static/Img/Logo-LJ.png';
import UserImg from '../Static/Img/User.png';
import '../Static/Styles/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faGear, faSliders } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Profile from '../Components/Profile';

const NavMenu = () => {
    const location= useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const navigate = useNavigate();
    const rol = localStorage.getItem('role');
    const isAuthenticated = localStorage.getItem('username') !== null;
    const [showProfile, setShowProfile] = useState(false);
    const [profileImage, setProfileImage] = useState(UserImg);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchProfileImage = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/register/ver-imagen', {
                        responseType: 'arraybuffer',
                        withCredentials: true
                    });

                    if (response.status === 200) {
                        const base64String = btoa(
                            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );
                        setProfileImage(`data:image/jpeg;base64,${base64String}`);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        setProfileImage(UserImg);
                    } else {
                        console.error('Error fetching profile image:', error);
                    }
                }
            };
            fetchProfileImage();
        }
    }, [isAuthenticated]);

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            navigate('/');
        } catch (error) {
            console.error('Error during logout', error);
        }
    };

    const handleShowProfile = () => setShowProfile(true);
    const handleCloseProfile = () => setShowProfile(false);

    const handleHashClick = (e) => {
        if (e.target.getAttribute('href') === '#') {
          e.preventDefault();
          navigate('/noroute');
        }
      };


    React.useEffect(() => {
        setActiveItem(location.pathname); 
    }, [location]);

    const getActiveClass = (path) => {
        return location.pathname === path ? 'border-bottom border-primary' : '';
    };
  
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-light shadow-sm">
                <div className="container-fluid" onClick={handleHashClick}>
                    <a href='/Home'><img src={Logo} className='img-sm mx-5' alt='Logo...' /></a>
                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto me-7">
                            <li className="nav-item">
                                <Link className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/home')}`} to="/home">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/courses')}`} to="/courses">Cursos</Link>
                            </li>
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <Link className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/Document')}`} to="/Document">Documentación</Link>
                                </li>
                            )}

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/exercises')}`}
                                        to="/exercises"
                                    >
                                        Practica
                                    </Link>
                                </li>
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <Link className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/forum')}`} to="/forum">Foro</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/contact')}`} to="/contact">Contacto</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link fs-5 mt-2 fw-light ${getActiveClass('/about-us')}`} to="/about-us">Acerca de</Link>
                            </li>
                            {!isAuthenticated ? (
                                <li className="nav-item nav-login">
                                    <a className='btn btn-dark text-decoration-none text-light text-center' href="/login">Login</a>
                                </li>
                            ) : (
                                <li className='nav-item dropdown'>
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.stopPropagation()}>
                                        <img src={profileImage} alt='User Profile' style={{ width: '75px', height: '75px', marginTop: '-15px', objectFit: 'cover', borderRadius:'50px' }} />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li><button className="dropdown-item" onClick={handleShowProfile}><FontAwesomeIcon icon={faGear} /> Perfil</button></li>
                                        {rol==='ROLE_ADMIN' &&(
                                            <li><a className="dropdown-item" href="/panel"><FontAwesomeIcon icon={faSliders} /> Panel Admin</a></li>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li className="dropdown-item">
                                            <button className='btn btn-danger' onClick={handleLogout} variant="outline-danger">
                                                Logout <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <Profile showModal={showProfile} handleClose={handleCloseProfile} />
        </div>
    );
};

export default NavMenu;
