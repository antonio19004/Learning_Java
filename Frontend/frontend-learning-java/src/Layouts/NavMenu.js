import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const rol = localStorage.getItem('role');
    const isAuthenticated = localStorage.getItem('username') !== null;
    const [showProfile, setShowProfile] = useState(false);

    const [profileImage, setProfileImage] = useState(UserImg);

    useEffect(() => {
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
    }, []);

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            navigate('/login');
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

      const handleSpecificClick = (e) => {
        e.stopPropagation();
      };

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid" onClick={handleHashClick}>
                    <a href='/Home'><img src={Logo} className='NavLogo mx-5' alt='Logo...' /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <ul className="navbar-nav ms-auto me-7 py-4">
                        <li className="nav-item mt-3">
                            <a className="navbar-brand" href="/Home">Home</a>
                        </li>
                        <li className="nav-item mt-3">
                            <a className="navbar-brand" href="/Document">Documentos</a>
                        </li>
                        <li className="nav-item mt-3">
                            <a className="navbar-brand" href="#">Cursos</a>
                        </li>
                        <li className="nav-item mt-3">
                            <a className="navbar-brand" href="/forum">Foro</a>
                        </li>
                        <li className="nav-item mt-3">
                            <a className="navbar-brand" href="/contact">Contáctanos</a>
                        </li>
                        <li className="nav-item mt-3">
                            <a className="navbar-brand" href="/about-us">Sobre Nosotros</a>
                        </li>
                        {!isAuthenticated ? (
                            <li className="nav-item">
                                <button className='btn btn-dark' variant="outline-success" style={{ marginTop: '10px' }}>
                                    <a className='text-decoration-none text-light' href="/login">Login</a>
                                </button>
                            </li>
                        ) : (
                            <li className='nav-item dropdown'>
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.stopPropagation()}>
                                    <img src={profileImage} alt='User Profile' style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius:'50px' }} />
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
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
            </nav>
            <Profile showModal={showProfile} handleClose={handleCloseProfile} />
        </div>
    );
};

export default NavMenu;
