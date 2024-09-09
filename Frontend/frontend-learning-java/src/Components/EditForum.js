import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from "../Layouts/Loader";

const EditForum = () => {

    document.title = 'Edit Forum';
    const { id } = useParams();
    const [foro, setForo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/forum/${id}`, { withCredentials: true })
            .then(response => { 
                setForo(response.data);
            })
            .catch(error => { console.error(error)
                setError('Error al cargar el tema')
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!foro.titulo || !foro.contenido) {
            setError('Por favor, llena todos los campos.');
            return;
        }

        try {
            setError(null);

            const response = await axios.put(`http://localhost:8080/forum/${id}`, foro, { withCredentials: true });
            
            if (response.status === 200) {
                navigate('/panel/forum-settings');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("Tema no encontrado");
            } else {
                setError("Error al actualizar el tema");
            }
        }
    };

    return (
        <div className='forum-container my-5'>
            {foro ? (
                <div>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <p className="text-danger text-center">{error}</p>
                        </div>
                    )}<br />
                    <h2 className='fw-bold mb-4 text-center'>Editar Tema</h2><br />
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <input className='form-control' type="text" value={foro.titulo} onChange={(e) => setForo({ ...foro, titulo: e.target.value })} placeholder='Título' />
                        </div><br />
                        <div className='mb-3'>
                            <textarea className='form-control' value={foro.contenido} onChange={(e) => setForo({ ...foro, contenido: e.target.value })} placeholder='Contenido' />
                        </div><br />
                        <center><button className='btn btn-dark send-btn-dark' type="submit">Actualizar</button></center>
                    </form>
                </div>
            ) : (
                <div className='panelcenter'>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default EditForum;
