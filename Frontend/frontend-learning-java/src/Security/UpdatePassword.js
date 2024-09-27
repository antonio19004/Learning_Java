import React, { useState } from 'react';
import axios from 'axios';
import NavMenu from '../Layouts/NavMenu.js';
import Footer from '../Layouts/Footer.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const rol = localStorage.getItem('role');
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handlePasswordUpdateAdminSubmit = async (e) => {
        e.preventDefault();

        if (!password || !newPassword || !confirmPassword) {
            setErrorMessage("Por favor, llena todos los campos.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("La contraseña no coincide");
            return;
        }

        const data = {
            password,
            newPassword
        };

        try {
            const response = await axios.post('https://backend-learning-java.onrender.com/admin/update-password', data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                navigate('/Home');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error('Ocurrió un error al momento de actualizar la contraseña: ', error);
                setErrorMessage('Error al momento de actualizar la contraseña. Inténtelo de nuevo');
            }
        }
    };

    const handlePasswordUpdateUserSubmit = async (e) => {
        e.preventDefault();

        if (!password || !newPassword || !confirmPassword) {
            setErrorMessage("Por favor, llena todos los campos.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("La contraseña no coincide");
            return;
        }

        const data = {
            password,
            newPassword
        };

        try {
            const response = await axios.post('https://backend-learning-java.onrender.com/users/update-password', data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                navigate('/Home');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error('Ocurrió un error al momento de actualizar la contraseña: ', error);
                setErrorMessage('Error al momento de actualizar la contraseña. Inténtelo de nuevo');
            }
        }
    };

    return (
        rol === 'ROLE_ADMIN' ? (
            <div>
                <header>
                    <NavMenu />
                </header>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    {errorMessage && (
                        <div className="alert alert-danger w-50 p-1 mx-auto mt-4"  role="alert">
                            <p className="text-danger text-center">{errorMessage}</p>
                        </div>
                    )}
                    <h2 className='fw-bold'>Cambia tu Contraseña</h2><br />
                    <form onSubmit={handlePasswordUpdateAdminSubmit}>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input className='form-control' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña Actual' />
                            <span className="position-absolute" onClick={toggleShowPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div><br />
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input className='form-control' type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Nueva Contraseña' />
                            <span className="position-absolute" onClick={toggleShowNewPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </span> 
                        </div><br />
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input className='form-control' type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirmar contraseña' />
                            <span className="position-absolute" onClick={toggleShowConfirmPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </span>
                        </div><br />
                        <button className='btn btn-dark ms-5' type="submit" style={{ width: '130px' }}>Actualizar</button>
                    </form>
                </div>
                <Footer />
            </div>
        ) : (
            <div>
                <header>
                    <NavMenu />
                </header>
                <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '80vh' }}>
                    {errorMessage && (
                        <div className="alert alert-danger w-50 p-1 mx-auto mt-4"  role="alert">
                            <p className="text-danger text-center">{errorMessage}</p>
                        </div>
                    )}
                    <h2 className='fw-bold'>Cambia tu Contraseña</h2>
                    <h5 className='fw-light'>Completa los siguientes campos para actualizar tu contraseña</h5><br />
                    <form onSubmit={handlePasswordUpdateUserSubmit}>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input className='form-control' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña Actual' />
                            <span className="position-absolute" onClick={toggleShowPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div><br />
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input className='form-control' type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Nueva Contraseña' />
                            <span className="position-absolute" onClick={toggleShowNewPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </span>
                        </div><br />
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input className='form-control' type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirmar contraseña' />
                            <span className="position-absolute" onClick={toggleShowConfirmPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </span>
                        </div><br />
                        <button className='btn btn-dark ms-5' type="submit" style={{ width: '130px' }}>Actualizar</button>
                    </form>
                </div>
                <Footer />
            </div>
        )
    );
};

export default UpdatePassword;
