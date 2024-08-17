import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React,{useState,useEffect} from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import Panel from './Panel';
import '../Static/Styles/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';


const Document =()=>{

    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(true);

    const rol = localStorage.getItem('role');
    const baseUrl = rol === 'ROLE_USER' ? 'users' : 'admin';

    useEffect(() => {
        const obtenerArchivos = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/${baseUrl}/documentacion/listar`,{withCredentials:true});
                                               
                setArchivos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener la lista de archivos', error);
                setLoading(false);
            }
        };
        obtenerArchivos();
    }, []);

    const handleVerArchivo = async (id) => {
        window.open(`http://localhost:8080/${baseUrl}/documentacion/${id}`, '_blank');
    };

    const handleDescargarArchivo = async (id) => {
        window.location.href =  `http://localhost:8080/${baseUrl}/documentacion/descargar/${id}`;
    };
    console.log('Valor de archivos:', archivos);


    return(
        <div>
            <Panel/>
                <div className='docbody shadowinset'>
                    <div className="px-5 pt-4">
                    <h2 className='panelcenter pt-3 pb-5'>Lista de Archivos</h2>
                    {loading?(
                        <div className='panelcenter'>
                        <Loader/>
                        </div>
                    ):(
                    <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Nombre Documento</th>
                                <th>Ver Documento</th>
                                <th>Descargar Documento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {archivos.map(archivo => (
                                <tr key={archivo.id}>
                                    <td>{archivo.titulo}</td>
                                    <td>
                                        <button className="btn btn-dark me-3" onClick={() => handleVerArchivo(archivo.id)}><span><FontAwesomeIcon icon={faEye}/></span></button>
                                    </td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleDescargarArchivo(archivo.id)}><span><FontAwesomeIcon icon={faDownload}/></span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    )}
                </div>
            </div>
        </div>       
    );
}
export default Document;