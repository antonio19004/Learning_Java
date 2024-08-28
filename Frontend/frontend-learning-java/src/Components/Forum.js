import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import NavMenu from '../Layouts/NavMenu.js';
import Footer from '../Layouts/Footer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMessage, faEllipsisH, faThumbtack, faThumbtackSlash, faEye, faEyeSlash, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/Forum.css';

const Forum = () => {

    const [foro, setForo] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [error, setError] = useState(null);
    const rol = localStorage.getItem('role');
    const menuRefs = useRef([]);
    const navigate = useNavigate();

    const fetchForo = () => {
        axios.get('http://localhost:8080/forum', { withCredentials: true })
            .then(response => setForo(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchForo();
    }, []);

    const handleNewTopic = async () => {
        navigate('/new-forum');
    }

    const formatDate = (date) => {
        if (!date) return '';
        const fecha = new Date(date);
        const options = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        return fecha.toLocaleDateString('es-ES', options);
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
        }

        try {
            setError(null);

            const response = await axios.put(url, {}, { withCredentials: true });

            if (response.status === 200) {
                fetchForo();
                console.log(foro);
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

    const renderTableBody = () => {
        return foro.map((forum, index) => {
            const { formattedDate, lastModifier, isFixed, isHidden } = processForumData(forum);
            const rowClass = isHidden ? 'text-muted' : '';
            const pinIconColor = isFixed ? 'dark' : 'transparent';
            const textStyle = isHidden ? { color: 'darkgray', textDecoration: 'line-through' } : {};

            return (
                <tr key={forum.id} className={rowClass}>
                    <td>
                        <Link to={`/forum-topic/${forum.id}`} className='link-foro' style={textStyle}>
                            <FontAwesomeIcon icon={faMessage} className="icon-left" style={{ marginRight: '10px' }} />
                            {forum.titulo}
                        </Link>
                    </td>
                    <td className='centered' style={textStyle}>{forum.respuestasCount}</td>
                    <td className='centered' style={textStyle}>
                        {lastModifier} - {formattedDate}
                        {isFixed && (
                            <FontAwesomeIcon icon={faThumbtack} style={{ marginLeft: '23px', color: pinIconColor }} />
                        )}
                    </td>
                    {rol === 'ROLE_ADMIN' && (
                        <td className='centered'>
                            <div className="dropdown" ref={el => menuRefs.current[index] = el}>
                                <FontAwesomeIcon icon={faEllipsisH} onClick={() => toggleMenu(forum.id)} className='centered' style={{ fontSize: '20px', cursor: 'pointer' }} />
                                {menuOpen === forum.id && (
                                    <div className="dropdown-menu show">
                                        <button className="dropdown-item" onClick={() => handleAction(forum.id, isFixed ? 'unpin' : 'pin')}>
                                            {isFixed ? (
                                                <span style={{ marginLeft: '15px' }}>Desanclar<FontAwesomeIcon icon={faThumbtackSlash} style={{ marginLeft: '10px' }} /></span>
                                            ) : (
                                                <span style={{ marginLeft: '15px' }}>Anclar<FontAwesomeIcon icon={faThumbtack} style={{ marginLeft: '23px' }} /></span>
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
                                        <button className="dropdown-item" onClick={() => handleAction(forum.id, 'delete')}><span style={{ marginLeft: '15px', color: 'red' }}>Eliminar<FontAwesomeIcon icon={faTrash} style={{ marginLeft: '10px' }} /></span></button>
                                    </div>
                                )}
                            </div>
                        </td>
                    )}
                </tr>
            );
        });
    };

    return (
        <div>
            <header>
                <NavMenu />
            </header>
            <div className='container mt-4'>
                <h2 className='fw-bold text-center mb-4'>Foro de Discusión</h2><br />
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <p className="text-danger text-center">{error}</p>
                    </div>
                )}
                <table className='table-foro'>
                    <thead>
                        <tr>
                            <th>Tema</th>
                            <th className='centered'><FontAwesomeIcon icon={faComments} style={{ width:'25px', height: '25px'}} /></th>
                            <th className='centered'>Última Modificación</th>
                            {rol === 'ROLE_ADMIN' && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableBody()}
                    </tbody>
                </table>
                <button className="btn btn-dark agg-btn" onClick={handleNewTopic}>Agregar Nuevo Tema</button>
            </div>
            <Footer />
        </div>
    );
};

export default Forum;
