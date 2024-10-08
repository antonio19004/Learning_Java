import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Static/Styles/NewForum.css';

const AddForum = () => {

    document.title = 'Nuevo Foro';
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo || !contenido) {
            setErrorMessage('Por favor, llena todos los campos.');
            return;
        }

        const data = {
            titulo,
            contenido
        };

        try {
            const response = await axios.post('https://backend-learning-java.onrender.com/forum', data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 201) {
                navigate('/panel/forum-settings');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error('Ocurrió un error al crear el foro: ', error);
                setErrorMessage('Error al crear el foro. Inténtelo de nuevo');
            }
        }
    };

    return(
        <div>
            <div className='forum-container my-5'>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        <p className="text-danger text-center">{errorMessage}</p>
                    </div>
                )}<br />
                <h2 className='fw-bold mb-4 text-center'>Nuevo Foro</h2><br />
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <input className='form-control' type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder='Título' />
                    </div><br />
                    <div className='mb-3'>
                        <textarea className='form-control' value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder='Contenido' />
                    </div><br />
                    <center><button className='btn btn-dark send-btn-dark' type="submit">Agregar</button></center>
                </form>
            </div>
        </div>
    );
};

export default AddForum;
