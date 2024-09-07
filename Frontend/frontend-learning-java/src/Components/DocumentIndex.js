import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React,{useState,useEffect} from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import '../Static/Styles/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faDownload, faEye, faFolder, faInfo, faSearch,faFileWord,faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import Logo from '../Static/Img/Logo-LJ.png'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import NavMenu from '../Layouts/NavMenu';
import Footer from '../Layouts/Footer';


const Document =()=>{
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
                const response = await axios.get(`http://localhost:8080/${baseUrl}/documentacion/listar`, { withCredentials: true });
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
        window.open(`http://localhost:8080/${baseUrl}/documentacion/${id}`, '_blank');
    };

    const handleDescargarArchivo = async (id) => {
        window.location.href =  `http://localhost:8080/${baseUrl}/documentacion/descargar/${id}`;
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
            <div className="px-5 pt-4">
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
                                   const {icon,color} = getFileIcon(archivo.tipo); 

    
                                    return (
                                        <div className="col-md-4" key={archivo.id}>
                                            <div className="card mb-4">
                                                <div className="card-header d-flex justify-content-between align-items-center">
                                                    <span className='pe-1'><FontAwesomeIcon className='pe-1' icon={icon} size='xl' style={{color:color}} /></span>
                                                    <small className='text-muted'>{formattedDate}</small>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className='fw-bold'><FontAwesomeIcon icon={faJava} size='xl' /> {archivo.titulo}</h5>
                                                    <button
                                                        className="btn btn-dark me-3 mt-4"
                                                        onClick={() => handleVerArchivo(archivo.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        className="btn btn-primary mt-4"
                                                        onClick={() => handleDescargarArchivo(archivo.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faDownload} />
                                                    </button>
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
            <Footer/>
        </div>
    );
}    
export default Document;