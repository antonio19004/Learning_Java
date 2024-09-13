import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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
            const response = await axios.post('https://backend-learning-java.onrender.com/password/reset',  username, {
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
        <div className='container'>
            <div style={{ marginLeft: '40px', marginTop: '20px' }}>
                <a href='/login' className="text-decoration-none text-blue-dark">
                    <FontAwesomeIcon icon={faChevronLeft} size='xl' />
                </a>
            </div><br />
            <div className='d-flex flex-column align-items-center justify-content-center '>
                <div className='shadow bg-light p-4 p-sm-5 my-4 rounded' style={{ maxWidth: '500px', width: '100%' }}>
                    <h2 className='fw-bold text-center mb-4'>Recupera tu Contraseña</h2>
                    <h5 className='fw-light text-center mb-4'>Ingresa tu usuario y enviaremos a tu correo una nueva contraseña</h5>
                    {errorMessage && !successMessage && (
                        <div className="alert alert-danger" role="alert">
                            <p className="text-danger text-center">{errorMessage}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            <p className="text-success text-center">{successMessage}</p>
                        </div>
                    )}
                    <form onSubmit={handleUsernameSubmit} className='w-100'>
                        <div className="input-group mb-3">
                            <span className="input-group-text"> 
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                        </div>
                        <br />
                        <center><button className='btn btn-dark ms-5' type="submit">Restablecer</button></center>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
