import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import NavMenu from '../Layouts/NavMenu.js';
import Footer from '../Layouts/Footer.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/ForumDetail.css';
import UserImg from '../Static/Img/User.png';

const ForumDetail = () => {
    const { id } = useParams();
    const [foro, setForo] = useState(null);
    const [respuestas, setRespuestas] = useState([]);
    const [newRespuesta, setNewRespuesta] = useState('');
    const [newResponse, setNewResponse] = useState('');
    const [replies, setReplies] = useState({});
    const [replying, setReplying] = useState(null);
    const [showReplies, setShowReplies] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8080/forum/${id}`, { withCredentials: true })
            .then(response => setForo(response.data))
            .catch(error => console.error(error));

        axios.get(`http://localhost:8080/forum/${id}/respuestas`, { withCredentials: true })
            .then(response => setRespuestas(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const data = { contenido: newRespuesta };

        try {
            const response = await axios.post(`http://localhost:8080/forum/${id}/respuesta`, data, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.status === 201) {
                setRespuestas([...respuestas, response.data]);
                setNewRespuesta('');
            }
        } catch (error) {
            console.error('Ocurrió un error en el envío: ', error);
        }
    };

    const handleReplyClick = (id) => {
        setReplying(id);
        setShowReplies({});
    };

    const handleShowClick = async (responseId) => {
        setReplying(null);

        if (!replies[responseId]) {
            try {
                const response = await axios.get(`http://localhost:8080/forum/${responseId}/responses`, { withCredentials: true });
                setReplies(prevReplies => ({
                    ...prevReplies,
                    [responseId]: response.data
                }));
            } catch (error) {
                console.error('Error al cargar las respuestas:', error);
            }
        }

        setShowReplies(prev => ({
            ...prev,
            [responseId]: !prev[responseId]
        }));
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        const responseData = { contenido: newResponse };

        try {
            if (!replies[replying] || replies[replying].length === 0) {
                const previousResponses = await axios.get(`http://localhost:8080/forum/${replying}/responses`, {
                    withCredentials: true
                });
                setReplies(prevReplies => ({
                    ...prevReplies,
                    [replying]: previousResponses.data
                }));
            }
            
            const response = await axios.post(`http://localhost:8080/forum/${replying}/response`, responseData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
    
            if (response.status === 200) {
                setReplies(prevReplies => ({
                    ...prevReplies,
                    [replying]: [...prevReplies[replying], response.data]
                }));
                setShowReplies(prev => ({
                    ...prev,
                    [replying]: true
                }));
                setNewResponse('');
                setReplying(null);
            }
        } catch (error) {
            console.error('Ocurrió un error en el envío: ', error);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !newRespuesta.trim()) {
            e.preventDefault();
        }
    };

    const handlePress = (e) => {
        if (e.key === 'Enter' && !newResponse.trim()) {
            e.preventDefault();
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const fecha = new Date(date);
        const options = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        return fecha.toLocaleDateString('es-ES', options);
    };

    return (
        <div>
            <header>
                <NavMenu />
            </header>
            {foro ? (
                <div className='card mb-6'>
                    <div className='card-body'>
                        <div className='d-flex align-items-start mb-3' style={{ marginLeft: '20px' }}>
                            {foro.user?.imagenPerfil ? (
                                <img src={`data:image/jpeg;base64,${foro.user.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '110px', height: '110px', objectFit: 'cover' }} />
                            ) : foro.admin?.imagenPerfil ? (
                                <img src={`data:image/jpeg;base64,${foro.admin.imagenPerfil}`} alt="Imagen de perfil de administrador" className="rounded-circle me-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            ) : (
                                <img src={UserImg} className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                            )}
                            <div style={{ marginLeft: '10px' }}>
                                <h2 className='card-tittle'>{foro.titulo}</h2>
                                <p className='card-subtitle mb-2 text-muted'>
                                    {foro.user?.user ? foro.user.user : foro.admin?.user ? foro.admin.user : 'Usuario desconocido'} - {formatDate(foro.fechaPublicacion)}
                                </p>
                                <p className='card-text'>{foro.contenido}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h5 style={{ marginLeft: '85%' }}>{respuestas.length} Comentarios</h5>
                            <hr />
                            {respuestas.map(respuesta => (
                                <div key={respuesta.id} className='mb-3 border p-3 rounded'>
                                    <div className='d-flex align-items-start mb-3'>
                                        {respuesta.user?.imagenPerfil ? (
                                            <img src={`data:image/jpeg;base64,${respuesta.user.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                        ) : respuesta.admin?.imagenPerfil ? (
                                            <img src={`data:image/jpeg;base64,${respuesta.admin.imagenPerfil}`} alt="Imagen de perfil de administrador" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                        ) : (
                                            <img src={UserImg} className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                        )}
                                        <div>
                                            <p className='mb-1'><strong>{respuesta.user?.user ? respuesta.user.user : respuesta.admin?.user ? respuesta.admin.user : 'Usuario desconocido'}</strong> - {formatDate(respuesta.fechaPublicacion)}</p>
                                            <p>{respuesta.contenido}</p>
                                            <button onClick={() => handleReplyClick(respuesta.id)} className='btn btn-link p-0' style={{ textDecoration: 'none' }}>Responder</button>
                                            <button onClick={() => handleShowClick(respuesta.id)} className='btn btn-link p-0' style={{ textDecoration: 'none', marginLeft: '15px' }}>
                                                {showReplies[respuesta.id] ? 'Ocultar respuestas' : 'Ver respuestas'}
                                            </button>
                                            {showReplies[respuesta.id] && (
                                                <div className='mt-3'>
                                                    {replies[respuesta.id]?.length > 0 ? (
                                                        replies[respuesta.id].map(r => (
                                                            <div key={r.id} className='mb-3 border p-3 rounded'>
                                                                <div className='d-flex align-items-start mb-3'>
                                                                    {r.user?.imagenPerfil ? (
                                                                        <img src={`data:image/jpeg;base64,${r.user.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                                                    ) : r.admin?.imagenPerfil ? (
                                                                        <img src={`data:image/jpeg;base64,${r.admin.imagenPerfil}`} alt="Imagen de perfil de administrador" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                                                    ) : (
                                                                        <img src={UserImg} className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                                                    )}
                                                                    <div>
                                                                        <p className='mb-1'><strong>{r.user?.user ? r.user.user : r.admin?.user ? r.admin.user : 'Usuario desconocido'}</strong> - {formatDate(r.fechaPublicacion)}</p>
                                                                        <p>{r.contenido}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>No hay respuestas disponibles.</p>
                                                    )}
                                                </div>
                                            )}
                                            {replying === respuesta.id && (
                                                <form onSubmit={handleReplySubmit} className='position-relative mt-3'>
                                                    <div className='textarea-container'>
                                                        <textarea className='form-control' rows='2' value={newResponse} onChange={(e) => setNewResponse(e.target.value)} onKeyPress={handlePress} placeholder='Escribe tu respuesta aquí...' style={{ height: '40%', width: '100%' }} />
                                                        <button type="submit" className='btn btn-dark mt-2' disabled={!newResponse.trim()}>Enviar</button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleCommentSubmit} className='position-relative'>
                            <div className='textarea-container'>
                                <textarea className='form-control' rows="3" value={newRespuesta} onChange={e => setNewRespuesta(e.target.value)} onKeyPress={handleKeyPress} placeholder="Escribe tu comentario aquí..." style={{ height: '40%' }} />
                                <button type="submit" className='btn btn-dark' disabled={!newRespuesta.trim()}>Enviar</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
            <Footer />
        </div>
    );
};

export default ForumDetail;
