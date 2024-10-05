import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import fondo from '../Static/Img/loginfonde.jpg';

function Login() {
    document.title = 'Login';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => {
            setErrorMessage('');
        }, 7000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            showError("Por favor, llena todos los campos.");
            return;
        }

        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        try {
            setLoading(true);
            const response = await axios.post('https://backend-learning-java.onrender.com/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                const { role } = response.data;

                if (role) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('role', role);
                    setTimeout(() => navigate('/Home'), 3000);
                } else {
                    showError('Autenticación fallida. Inténtelo de Nuevo.');
                    setLoading(false);
                }
            } else {
                showError('Autenticación fallida. Inténtelo de Nuevo.');
                setLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                showError('Autenticación fallida. Inténtelo de Nuevo.');
                setLoading(false);
            } else {
                console.error('Ocurrió un error en la autenticación:', error);
                showError('Autenticación fallida. Inténtelo de Nuevo.');
                setLoading(false);
            }
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '5%',
            paddingLeft: '5%'
        }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ marginLeft: '40px' }}>
                    <a href='/' className="text-decoration-none text-blue-dark">
                        <FontAwesomeIcon icon={faChevronLeft} size='xl' />
                    </a>
                </div><br />
                <div className='shadow bg-light px-5 pb-5 rounded'>
                    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '70vh', marginTop: '0' }}>
                        {errorMessage && (
                            <div className="alert alert-danger w-100 text-center mx-auto" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <h2 className='fw-bold text-center mt-3'>Ingresa con tus credenciales</h2>
                        <h5 className='fw-light'>Inicia sesión con tu usuario y contraseña</h5><br />
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                            </div>
                            <br />
                            <div className="input-group mb-3 position-relative">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                <input className='form-control' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña' />
                                <span className="position-absolute" onClick={() => setShowPassword(!showPassword)} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </span>
                            </div>
                            <br />
                            <button className='btn btn-dark w-100' type="submit" disabled={loading}>
                                {loading ? 'Cargando...' : 'Iniciar Sesión'}
                            </button>
                        </form>
                        <br />
                        <h5 className='fw-light'>O crea una cuenta si no estás registrado</h5>
                        <h5 className='fw-bold'><a className='text-decoration-none text-dark' href='/register'>Registrarse</a></h5>
                        <h5 className='fw-bold'><a className='text-decoration-none text-dark' href='/reset-password'>¿Has olvidado tu contraseña?</a></h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
