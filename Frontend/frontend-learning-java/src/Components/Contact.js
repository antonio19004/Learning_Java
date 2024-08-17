import React, { useState } from 'react';
import axios from 'axios';
import NavMenu from '../Layouts/NavMenu.js';
import Footer from '../Layouts/Footer.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/Contact.css';

function Contact() {
    document.title = 'Contacto';
    const [nombre , setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contenido, setContenido] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !email || !contenido) {
            setErrorMessage("Por favor, llena todos los campos.");
            return;
        }

        const data = {
            nombre,
            email,
            contenido,
        };

        try {
            const response = await axios.post('http://localhost:8080/contact', data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setSuccessMessage('Mensaje enviado con éxito');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error('Ocurrió un error en el envió: ', error);
                setErrorMessage('Error al enviar el mensaje. Inténtelo de nuevo');
            }
        }
    };

    return (
        <div>
            <header>
                <NavMenu />
            </header>
            <div className="header-image"></div>
            <div className="container mt-5 pt-5">
                <h2 className='fw-bold text-center'>¡Contáctanos!</h2> <br />
                <h6 className='fw-light text-center'>Déjanos tus mensajes a través de este formulario y nos pondremos en contacto contigo a la brevedad</h6><br/>
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
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Mensaje:</label>
                                <textarea className="form-control" value={contenido} onChange={(e) => setContenido(e.target.value)} />
                            </div>
                        </div>
                    </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-dark send-btn">Enviar</button>
                        </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Contact;
