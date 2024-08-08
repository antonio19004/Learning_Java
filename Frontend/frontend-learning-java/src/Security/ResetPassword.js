import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();

        if (!username) {
            setErrorMessage("Por favor, llena todos los campos.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/password/reset',  username, {
                headers: {
                    'Content-Type': 'text/plain'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                setSuccessMessage('Se ha enviado un correo con la nueva contraseña');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error(error);
                setErrorMessage('No se ha encontrado el usuario');
            }
        }
    };

    return (
        <div>
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '75vh' }}>
                {errorMessage && (
                    <div className="alert alert-danger w-50 p-1 mx-auto mt-4"  role="alert">
                        <p className="text-danger text-center">{errorMessage}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="alert alert-success w-50 p-1 mx-auto mt-4"  role="alert">
                        <p className="text-success text-center">{successMessage}</p>
                    </div>
                )}<br /><br />
                <h2 className='fw-bold'>Recupera tu Contraseña</h2><br />
                <h5 className='fw-light text-center'>Ingresa con tu usuario y enviaremos a tu correo una nueva contraseña</h5><br/>
                <form onSubmit={handleUsernameSubmit}>
                    <div className="input-group mb-3">
                        <span className="input-group-text"> 
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                    </div>
                    <br />
                    <button className='btn btn-dark ms-5' type="submit">Restablecer</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;
