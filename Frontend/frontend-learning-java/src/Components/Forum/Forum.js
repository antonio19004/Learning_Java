import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import NavMenu from '../../Layouts/NavMenu.js';
import Loader from "../../Layouts/Loader.js";
import Footer from '../../Layouts/Footer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMessage, faThumbtack, faVolumeHigh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Static/Styles/Forum.css';

const Forum = () => {
    document.title = 'Foro';
    
    const [foro, setForo] = useState([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
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
        navigate('/new-forum');
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
        return results.map((forum) => {
            const { formattedDate, lastModifier, isFixed, isHidden } = processForumData(forum);
            const pinIconColor = isFixed ? 'dark' : 'transparent';
            const textStyle = isHidden ? { color: 'darkgray', textDecoration: 'line-through' } : {};

            return (
                <tr key={forum.id} className={`forum-row ${isHidden ? 'hidden-row' : ''}`}>
                    <td>
                        <Link to={`/forum-topic/${forum.id}`} className='link-foro' style={textStyle}>
                            <FontAwesomeIcon icon={faMessage} className="icon-left" style={{ marginRight: '10px' }} />
                            {forum.titulo}
                        </Link>
                    </td>
                    <td style={{ ...textStyle, textIndent: '10px' }}>{forum.respuestasCount}</td>
                    <td style={{ ...textStyle, textAlign: 'center' }}>
                        {lastModifier} - {formattedDate}
                        {isFixed && (
                            <FontAwesomeIcon icon={faThumbtack} style={{ marginLeft: '10px', color: pinIconColor, transform: 'rotate(40deg)' }} />
                        )}
                    </td>
                </tr>
            );
        });
    };

    return (
        <div>
            <header>
                <NavMenu />
            </header>
            <div className='m-3'>
            <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
                {loading ? (
                    <center><div className='d-flex justify-content-center'>
                        <Loader />
                    </div></center>
                ) : (
                    <div>
                        <h2 className='fw-bold mb-4'><FontAwesomeIcon icon={faVolumeHigh} style={{ marginRight: '10px', transform: 'rotate(-40deg)' }} /> Foro de Discusión</h2><br />
                        <div className="input-group w-50 mb-4">
                            <span className="input-group-text" id="basic-addon1" style={{ marginBottom: '15px' }}><FontAwesomeIcon icon={faSearch} /></span>
                            <input type="text" className="form-control" placeholder="Buscar Tema..." aria-label="Buscar Tema..." aria-describedby="basic-addon1" value={query} onChange={handleSearch} style={{ marginBottom: '15px' }} />
                        </div>
                        <div className="table-responsive rounded">
                            <table className='table table-foro'>
                                <thead>
                                    <tr>
                                        <th>Tema</th>
                                        <th style={{ textIndent: '5px' }}><FontAwesomeIcon icon={faComments} style={{ width:'25px', height: '25px'}} /></th>
                                        <th style={{ textAlign: 'center' }}>Última Modificación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableBody()}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-dark agg-btn" onClick={handleNewTopic}>Nuevo Tema</button>
                        </div>
                    </div>
                )}
            </div>
            </div>
            </div>

            <Footer />
        </div>
    );
};

export default Forum;
