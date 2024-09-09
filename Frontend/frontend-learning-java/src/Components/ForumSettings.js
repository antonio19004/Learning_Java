import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Loader from "../Layouts/Loader";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMessage, faEllipsisH, faThumbtack, faThumbtackSlash, faEye, faEyeSlash, faPenToSquare, faTrash, faVolumeHigh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/Forum.css';

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
        axios.get('http://localhost:8080/forum', { withCredentials: true })
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
            url = `http://localhost:8080/forum/${id}/pin`;
        } else if (action === 'unpin') {
            url = `http://localhost:8080/forum/${id}/unpin`;
        } else if (action === 'hide') {
            url = `http://localhost:8080/forum/${id}/hide`;
        } else if (action === 'show') {
            url = `http://localhost:8080/forum/${id}/show`;
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
                await axios.delete(`http://localhost:8080/forum/${id}`, { withCredentials: true });
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

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.trim() === '') {
            setResults(foro);
        } else {
            const filteredResults = foro.filter(forum => 
                forum.titulo && forum.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        }
    };

    const renderTableBody = () => {
        return results.map((forum, index) => {
            const { formattedDate, lastModifier, isFixed, isHidden } = processForumData(forum);
            const pinIconColor = isFixed ? 'dark' : 'transparent';
            const textStyle = isHidden ? { color: 'darkgray', textDecoration: 'line-through' } : {};

            return (
                <tr key={forum.id}>
                    <td>
                        <Link to={`/forum-topic/${forum.id}`} className='link-foro' style={textStyle}>
                            <FontAwesomeIcon icon={faMessage} className="icon-left" style={{ marginRight: '10px' }} />
                            {forum.titulo}
                        </Link>
                    </td>
                    <td style={{ ...textStyle, textIndent: '100px' }}>{forum.respuestasCount}</td>
                    <td style={{ ...textStyle, textIndent: '120px', textAlign: 'justify' }}>
                        {lastModifier} - {formattedDate}
                        {isFixed && (
                            <FontAwesomeIcon icon={faThumbtack} style={{ marginLeft: '23px', color: pinIconColor, transform: 'rotate(40deg)' }} />
                        )}
                    </td>
                    <td className='centered'>
                        <div className="dropdown" ref={el => menuRefs.current[index] = el}>
                            <FontAwesomeIcon icon={faEllipsisH} onClick={() => toggleMenu(forum.id)} className='centered' style={{ fontSize: '20px', cursor: 'pointer' }} />
                            {menuOpen === forum.id && (
                                <div className="dropdown-menu show">
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
                                    <button className="dropdown-item" onClick={() => handleAction(forum.id, 'edit')}><span style={{ marginLeft: '15px' }}>Editar<FontAwesomeIcon icon={faPenToSquare} style={{ marginLeft: '25px' }} /></span></button>
                                    <button className="dropdown-item" onClick={() => handleDeleteTopic(forum.id)}><span style={{ marginLeft: '15px', color: 'red' }}>Eliminar<FontAwesomeIcon icon={faTrash} style={{ marginLeft: '10px' }} /></span></button>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div>
            <div className='container mt-4'>
                {loading ? (
                    <div className='panelcenter'>
                        <Loader />
                    </div>
                ) : (
                    <div>
                        <h2 className='fw-bold mb-4'><FontAwesomeIcon icon={faVolumeHigh} style={{ marginRight: '10px', transform: 'rotate(-40deg)' }} /> Foro de Discusión</h2><br />
                        <div className="input-group mb-4 w-50">
                            <span className="input-group-text" id="basic-addon1" style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faSearch} /></span>
                            <input type="text" className="form-control" placeholder="Buscar Tema..." aria-label="Buscar Tema..." aria-describedby="basic-addon1" value={query} onChange={handleSearch} style={{ marginBottom: '15px' }} />
                        </div>
                        {error && (
                            <div>
                                <div className="alert alert-danger" role="alert">
                                    <p className="text-danger text-center">{error}</p>
                                </div><br />
                            </div>
                        )}
                        <table className='table-foro'>
                            <thead>
                                <tr>
                                    <th>Tema</th>
                                    <th style={{ textIndent: '95px' }}><FontAwesomeIcon icon={faComments} style={{ width:'25px', height: '25px'}} /></th>
                                    <th style={{ textIndent: '140px' }}>Última Modificación</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody()}
                            </tbody>
                        </table>
                        <button className="btn btn-dark agg-btn" onClick={handleNewTopic}>Nuevo Tema</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumSettings;
