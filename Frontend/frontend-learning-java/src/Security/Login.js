import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Login () {
    document.title = 'Login';
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setErrorMessage("Por favor, llena todos los campos.");
            return;
        }

        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
    
        try {
            setLoading(true); 
            const response = await axios.post('http://localhost:8080/login', params, {
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
                    setTimeout(() =>navigate('/Home'),3000);
                } else {
                    setErrorMessage('Autenticación fallida. Inténtelo de Nuevo.');
                    setLoading(false);
                }
            } else {
                setErrorMessage('Autenticación fallida. Inténtelo de Nuevo.');
                setLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Autenticación fallida. Inténtelo de Nuevo.');
                setLoading(false);
            } else {
                console.error('Ocurrió un error en la autenticación:', error);
                setErrorMessage('Autenticación fallida. Inténtelo de Nuevo.');
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '100vh' }}>
                {errorMessage && (
                    <div className="alert alert-danger w-50 p-1 mx-auto mt-4"  role="alert">
                        <p className="text-danger text-center">{errorMessage}</p>
                    </div>
                )}
                <h2 className='fw-bold'>Ingresa con tus credenciales</h2>
                <h5 className='fw-light'>Inicia sesión con tu usuario y contraseña</h5><br/>
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <span className="input-group-text"> 
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                    </div>
                    <br />
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input className='form-control' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña' />
                        <span className="position-absolute" onClick={() => setShowPassword(!showPassword)} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <br />
                    <button className='btn btn-dark ms-5' type="submit">Iniciar Sesión</button>
                </form>
                <br/>
                <h5 className='fw-light'>O crea una cuenta si no estas registrado</h5>
                <h5 className='fw-bold'><a className='text-decoration-none text-dark hover:text-secondary' href='/register'>Registrarse</a></h5>
                <h5 className='fw-bold'><a className='text-decoration-none text-dark hover:text-secondary' href='/reset-password'>¿Has olvidado tu contraseña?</a></h5>
            </div>
        </div>
    );
}

export default Login;
