import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Crear los parámetros en formato application/x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
    
        try {
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
            navigate('/welcome');
        } else {
            setErrorMessage('Autenticación fallida. Intentelo de Nuevo.');
        }
    } else {
        setErrorMessage('Autenticación fallida. Intentelo de Nuevo.');
    }
} catch (error) {
    if (error.response && error.response.status === 401) {
        setErrorMessage('Autenticación fallida. Intentelo de Nuevo.');
    } else {
        console.error('Ocurrio un error en la autenticación:', error);
        setErrorMessage('Autenticación fallida. Intentelo de Nuevo.');
    }
}
};


    return (
        <div>
              {errorMessage && (
                
                <div className="alert alert-danger w-50 p-1 mx-auto mt-4"  role="alert">
                    <p className="text-danger text-center">{errorMessage}</p>
                </div>
            )}
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '80vh' }}>
            <h2 className='fw-bold'>Ingresa con tus credenciales</h2>
            <h5 className='fw-light'>Inicia sesión con tu usuario y contraseña</h5><br/>
            <form onSubmit={handleSubmit}>
                    <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                <br />
                    <input className='form-control' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña' />
                <br />
                <button className='btn btn-dark ms-5' type="submit">Iniciar Sesión</button>
            </form>
            <br/>
            <h5 className='fw-light'>O crea una cuenta si no estas registrado</h5>
            <h5 className='fw-bold'><a className='text-decoration-none text-dark hover:text-secondary' href=''>Registrarse</a></h5><br/>
            </div>
        </div>
    );
}

export default Login;
