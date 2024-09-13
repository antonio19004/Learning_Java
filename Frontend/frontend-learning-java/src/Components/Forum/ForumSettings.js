import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Loader from "../../Layouts/Loader";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faEllipsisH, faThumbtack, faThumbtackSlash, faEye, faEyeSlash, faPenToSquare, faTrash, faVolumeHigh, faList } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Static/Styles/ForumSettings.css';

const ForumSettings = () => {

    document.title = 'Forum Settings';
    const [foro, setForo] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const menuRefs = useRef([]);
    const navigate = useNavigate();

    const fetchForo = () => {
        axios.get('https://backend-learning-java.onrender.com/forum', { withCredentials: true })
            .then(response => {
                setForo(response.data);
                setResults(response.data);
                setLoading(false)
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchForo();
    }, []);

    const handleNewTopic = async () => {
        navigate('/panel/add-forum');
    }

    const formatDate = (date) => {
        const distance = formatDistanceToNow(date, { addSuffix: true, locale: es });
    
        if (distance.includes('hace alrededor de')) {
            return distance.replace('hace alrededor de ', 'hace ');
        }
        return distance;
    };
    
    const processForumData = (forum) => {
        const formattedDate = formatDate(forum.fechaPublicacion);
        const lastModifier = forum.ultimoModificador || "Sin modificaciones";
        const isFixed = forum.fixed;
        const isHidden = forum.hidden;
        
        return {
            ...forum,
            formattedDate,
            lastModifier,
            isFixed,
            isHidden
        };
    };

    const toggleMenu = (id) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    const handleClickOutside = (event) => {
        if (menuRefs.current && !menuRefs.current.some(ref => ref && ref.contains(event.target))) {
            setMenuOpen(null);
        }
    };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAction = async (id, action) => {
        let url = '';

        if (action === 'pin') {
            url = `https://backend-learning-java.onrender.com/forum/${id}/pin`;
        } else if (action === 'unpin') {
            url = `https://backend-learning-java.onrender.com/forum/${id}/unpin`;
        } else if (action === 'hide') {
            url = `https://backend-learning-java.onrender.com/forum/${id}/hide`;
        } else if (action === 'show') {
            url = `https://backend-learning-java.onrender.com/forum/${id}/show`;
        } else if (action === 'edit') {
            navigate(`/panel/edit-forum/${id}`);
            return;
        }

        try {
            setError(null);

            const response = await axios.put(url, {}, { withCredentials: true });
            if (response.status === 200) {
                fetchForo();
                setMenuOpen(null);
            } else {
                throw new Error("Error inesperado al actualizar el tema.");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("Tema no encontrado.");
            } else {
                setError("Error al actualizar el tema.");
            }
        }
    };

    const handleDeleteTopic = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás visualizar este tema ni sus respuestas después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backend-learning-java.onrender.com/forum/${id}`, { withCredentials: true });
                Swal.fire(
                    'Eliminado!',
                    'El tema ha sido eliminado.',
                    'success'
                );
                setForo(foro.filter(topic => topic.id !== id));
                setResults(results.filter(topic => topic.id !== id));
            } catch (error) {
                console.error('Error al eliminar el tema', error);
                Swal.fire(
                    'Error!',
                    'No se pudo eliminar el archivo.',
                    'error'
                );
            }
        }
    }

    const renderTopics = () => {
        return results.map((forum, index) => {
            const { formattedDate, lastModifier, isFixed, isHidden } = processForumData(forum);
            const textStyle = isHidden ? { color: 'darkgray', textDecoration: 'line-through' } : {};
    
            return (
                <div key={forum.id} className="card mb-3" style={{ ...textStyle }}>
                    <div className="card-body">
                        <h5 className="card-title" style={{ position: 'relative' }}>
                            <Link to={`/forum-topic/${forum.id}`} className='link-foro'>
                                <FontAwesomeIcon icon={faMessage} className="icon-left" style={{ marginRight: '10px' }} />
                                {forum.titulo}
                            </Link>
                            {isFixed && (
                                <FontAwesomeIcon icon={faThumbtack} className="icon-thumbtack" />
                            )}
                            <div className="dropdown" ref={el => menuRefs.current[index] = el} style={{ position: 'absolute', top: '0', right: '0' }}>
                                <FontAwesomeIcon icon={faEllipsisH} onClick={() => toggleMenu(forum.id)} className='icon-ellipsis' style={{ cursor: 'pointer', fontSize: '20px' }} />
                                {menuOpen === forum.id && (
                                    <div className="dropdown-menu show" style={{ position: 'absolute', top: '100%', right: '0', zIndex: '1000' }}>
                                        <button className="dropdown-item" onClick={() => handleAction(forum.id, isFixed ? 'unpin' : 'pin')}>
                                            {isFixed ? (
                                                <span style={{ marginLeft: '15px' }}>Desanclar<FontAwesomeIcon icon={faThumbtackSlash} style={{ marginLeft: '10px' }} /></span>
                                            ) : (
                                                <span style={{ marginLeft: '15px' }}>Anclar<FontAwesomeIcon icon={faThumbtack} style={{ marginLeft: '23px', transform: 'rotate(40deg)' }} /></span>
                                            )}
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleAction(forum.id, isHidden ? 'show' : 'hide')}>
                                            {isHidden ? (
                                                <span style={{ marginLeft: '15px' }}>Mostrar<FontAwesomeIcon icon={faEye} style={{ marginLeft: '12px' }} /></span>
                                            ) : (
                                                <span style={{ marginLeft: '15px' }}>Ocultar<FontAwesomeIcon icon={faEyeSlash} style={{ marginLeft: '12px', color: 'gray' }} /></span>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </h5>
                        <p className="card-text">Última modificación: {lastModifier} - {formattedDate}</p>
                        <p className="card-text">Respuestas: {forum.respuestasCount}</p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-dark me-2" onClick={() => handleAction(forum.id, 'edit')}>
                                <FontAwesomeIcon icon={faPenToSquare} /> Editar
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDeleteTopic(forum.id)}>
                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            );            
        });
    };

    return (
        <div>
            <div className=''>
                {loading ? (
                    <div className='panelcenter'>
                        <Loader />
                    </div>
                ) : (
                    <div>
                        <div className='row'>
                            <div>
                                <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
                                    <h2 className='fw-bold mb-4'><FontAwesomeIcon icon={faVolumeHigh} style={{ marginRight: '10px', transform: 'rotate(-40deg)' }} /> Foro de Discusión</h2><br />
                                    <p>Creacion de Temas - Configuración del Foro</p>
                                    <button className="btn btn-success" onClick={handleNewTopic}>Nuevo Tema</button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div>
                                <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
                                    <div>
                                        <h2 style={{ marginBottom: '25px' }}><FontAwesomeIcon icon={faList} style={{ marginRight: '10px' }} />  Lista de Temas</h2>
                                        {error && (
                                            <div>
                                                <div className="alert alert-danger" role="alert">
                                                    <p className="text-danger text-center">{error}</p>
                                                </div><br />
                                            </div>
                                        )}
                                        {renderTopics()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumSettings;
