import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React,{useState,useEffect} from "react";
import axios from "axios";
import '../../Static/Styles/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faDownload, faEdit, faEllipsisV, faEye, faFilePdf, faFileWord, faFolder, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import Loader from '../../Layouts/Loader';

const Document = () => {
    document.title = 'Documentación';

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allDocuments, setAllDocuments] = useState([]);
    const navigate = useNavigate();

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

    const handleAddDocument = () => {
        navigate('/panel/add-document');
    };
    
    const handleEditDocument = (id) => {
        navigate(`/panel/edit-document/${id}`);
    };

    const handleDeleteDocument = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás recuperar este Documento después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backend-learning-java.onrender.com/${baseUrl}/documentacion/delete/${id}`, { withCredentials: true });
                Swal.fire(
                    'Eliminado!',
                    'El archivo ha sido eliminado.',
                    'success'
                );
                setResults(results.filter(archivo => archivo.id !== id));
            } catch (error) {
                console.error('Error al eliminar el archivo', error);
                Swal.fire(
                    'Error!',
                    'No se pudo eliminar el archivo.',
                    'error'
                );
            }
        }
    };

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

    return(
        <div>
        <div className="ms-3">
        <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
        <div>
            {loading ? (
                <div className='d-flex justify-content-center'>
                    <Loader />
                </div>
            ) : (
      
                <div>
                     <h2><FontAwesomeIcon icon={faFolder}/> Documentación</h2>
                    <p className='pb-4'>
                        Puedes gestionar los documentos
                    </p>

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

                    {rol==='ROLE_ADMIN' &&(
                          <div className="mb-4 ">
                          <button className="btn btn-success me-3 position-relative" onClick={handleAddDocument}>
                              <FontAwesomeIcon icon={faPlus} /> Nuevo Documento
                          </button>
                      </div>
                    )}
                   

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
                    
                    <div className="d-flex align-items-center d-none d-md-flex px-3">
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
                        {rol === 'ROLE_ADMIN' && (
                            <>
                                <a className="text-warning me-2 cursor-pointer" onClick={() => handleEditDocument(archivo.id)}>
                                    <FontAwesomeIcon icon={faEdit} size='xl' />
                                </a>
                                <a className="text-danger cursor-pointer" onClick={() => handleDeleteDocument(archivo.id)}>
                                    <FontAwesomeIcon icon={faTrash} size='xl' />
                                </a>
                            </>
                        )}
                    </div>
            
                    <div className="d-md-none">
                        <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon={faEllipsisV} size='xl'/>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item text-secondary" onClick={() => handleVerArchivo(archivo.id)}>
                                    <FontAwesomeIcon icon={faEye} size='lg' /> Ver
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item text-primary" onClick={() => handleDescargarArchivo(archivo.id)}>
                                    <FontAwesomeIcon icon={faDownload} size='lg' /> Descargar
                                </a>
                            </li>
                            {rol === 'ROLE_ADMIN' && (
                                <>
                                    <li>
                                        <a className="dropdown-item text-warning" onClick={() => handleEditDocument(archivo.id)}>
                                            <FontAwesomeIcon icon={faEdit} size='lg' /> Editar
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item text-danger" onClick={() => handleDeleteDocument(archivo.id)}>
                                            <FontAwesomeIcon icon={faTrash} size='lg' /> Eliminar
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
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
        </div>
    );
}

export default Document;
