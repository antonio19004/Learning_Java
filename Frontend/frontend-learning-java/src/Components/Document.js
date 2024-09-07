import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React,{useState,useEffect} from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import '../Static/Styles/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faDownload, faEdit, faEye, faFilePdf, faFileWord, faFolder, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 




const Document =()=>{
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

    const handleAddDocument = () => {
        navigate('/panel/add-document');
      };

      const handleEditDocument = (id) => {
        navigate(`/panel/edit-document/${id}`);
      };

      const handleDeleteDocument = async (id) => {
        // Mostrar alerta de confirmación
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
                await axios.delete(`http://localhost:8080/${baseUrl}/documentacion/delete/${id}`, { withCredentials: true });
                Swal.fire(
                    'Eliminado!',
                    'El archivo ha sido eliminado.',
                    'success'
                );
                // Actualiza la lista de archivos
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
        <div className="px-5 pt-4">
            {loading ? (
                <div className='panelcenter'>
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
                              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                                Admin
                                </span>
                          </button>
                      </div>
                    )}

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
                                        <span className='pe-1'><FontAwesomeIcon  icon={icon} size='xl' style={{color:color}} /></span>
                                            <small className='text-muted'>{formattedDate}</small>
                                            {rol==='ROLE_ADMIN' &&(
                                                <div>
                                                <button className="btn" onClick={()=>handleEditDocument(archivo.id)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                 <button className="btn me-1" onClick={()=>handleDeleteDocument(archivo.id)}>
                                                 <FontAwesomeIcon icon={faTrash} style={{color:"#b41610"}} />
                                                 </button>
                                                 </div>
                                                )}
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
                        <div class="alert alert-info" role="alert">
                          <FontAwesomeIcon icon={faCircleExclamation}/>  No hay Resultados!
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
    );
}
export default Document;