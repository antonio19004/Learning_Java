import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React,{useState,useEffect} from "react";
import axios from "axios";
import Loader from "../../Layouts/Loader";
import '../../Static/Styles/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faDownload, faEye, faFolder, faInfo, faSearch,faFileWord,faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import Logo from '../../Static/Img/Logo-LJ.png'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import NavMenu from '../../Layouts/NavMenu';
import Footer from '../../Layouts/Footer';


const Document =()=>{
    document.title='Documentación';
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allDocuments, setAllDocuments] = useState([]);

    const rol = localStorage.getItem('role');
    const baseUrl = rol === 'ROLE_USER' ? 'users' : 'admin';

    useEffect(() => {
        const obtenerArchivos = async () => {
            try {
                const response = await axios.get(`https://backend-learning-java.onrender.com/${baseUrl}/documentacion/listar`, { withCredentials: true });
                setAllDocuments(response.data);
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener la lista de archivos', error);
                setLoading(false);
            }
        };
        obtenerArchivos();
    }, [baseUrl]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.trim() === '') {
            setResults(allDocuments);
        } else {
            const filteredResults = allDocuments.filter(doc => 
                doc.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        }
    };
    const handleVerArchivo = async (id) => {
        window.open(`https://backend-learning-java.onrender.com/${baseUrl}/documentacion/${id}`, '_blank');
    };

    const handleDescargarArchivo = async (id) => {
        window.location.href =  `https://backend-learning-java.onrender.com/${baseUrl}/documentacion/descargar/${id}`;
    };
    console.log('Valor de archivos:', archivos);

    const formatRelativeDate = (date) => {
        const distance = formatDistanceToNow(date, { addSuffix: true, locale: es });
    
        if (distance.includes('hace alrededor de')) {
            return distance.replace('hace alrededor de ', 'hace ');
        }
        return distance;
    };

    const getFileIcon = (fileType) => {
        if (fileType === 'application/pdf') {
            return { icon: faFilePdf, color: '#cb2525' };
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
            return { icon: faFileWord, color: '#003185' };
        }
        return { icon: faFileWord, color: 'gray' }; 
    };

    return (
        <div>
            <NavMenu/>
            <div className="p-4">
            <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
                {loading ? (
                    <div className='panelcenter'>
                        <Loader />
                    </div>
                    ) : (
                    <div>
                        <h2><FontAwesomeIcon icon={faFolder}/> Documentación</h2>
                        
                        <a class="btn btn-primary mt-2 ms-2 mb-3" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                        <FontAwesomeIcon icon={faInfo}/> Información
                        </a>
                        <div class="collapse" id="collapseExample">
                        <div class="card card-body mb-4">
                           En esta Seccion encontraras material de apoyo sobre progrmación en JAVA que te puede servir como ayuda para estudiar algunos conceptos sencillos o hasta mas avanzados.
                        </div>
                        </div>
                        <div className="input-group mb-4 w-50">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar Documentos..."
                                aria-label="Buscar Documentos..."
                                aria-describedby="basic-addon1"
                                value={query}
                                onChange={handleSearch}
                            />
                        </div>
    
                        
                   {results.length > 0 ? (
    <div className="row">
        {results.map((archivo) => {
            const fecha = parseISO(archivo.fechaSubida);
            const formattedDate = formatRelativeDate(fecha);
            const { icon, color } = getFileIcon(archivo.tipo);

            return (
                <div className="col-12 mb-4" key={archivo.id}>
                    <div className="shadow bg-light d-flex flex-row align-items-center justify-content-between p-3 rounded">
                        
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={icon} size="xl" style={{ color: color }} className="me-3" />
                            <div>
                                <h5 className="fw-bold mb-0">
                                    <FontAwesomeIcon icon={faJava} size="xl" /> {archivo.titulo}
                                </h5>
                                <small className="text-muted">{formattedDate}</small>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-center px-3">
                            <a
                                className="text-secondary me-2 cursor-pointer"
                                onClick={() => handleVerArchivo(archivo.id)}
                            >
                                <FontAwesomeIcon icon={faEye} size='xl'/>
                            </a>
                            <a
                                className="text-primary me-2 cursor-pointer"
                                onClick={() => handleDescargarArchivo(archivo.id)}
                            >
                                <FontAwesomeIcon icon={faDownload} size='xl' />
                            </a>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
) : (
    <div className="alert alert-info" role="alert">
        <FontAwesomeIcon icon={faCircleExclamation} /> No hay Resultados!
    </div>
)}
                    </div>
                )}
            </div>
            </div>
            </div>
            <Footer/>
        </div>
    );
}    
export default Document;