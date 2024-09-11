import React,{useState} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faCaretLeft, faChevronLeft, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import '../../Static/Styles/Style.css';
import { useNavigate } from "react-router-dom";


const UploadDocument =()=>{

    const [file, setFile] = useState(null);
    const [titulo, setTitulo] = useState("");
    const rol = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTituloChange = (e) => {
        setTitulo(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('titulo', titulo);

        try {
            const response = await axios.post('http://localhost:8080/admin/documentacion/subir', formData,{withCredentials:true}, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Archivo subido con éxito');
            navigate('/panel/document');
            
        } catch (error) {
            console.error('Error al subir el archivo', error);
            alert('Error al subir el archivo');
        }
    };

    const iratras=()=>{
        navigate('/panel/document');
    }

    return(
        <div>
            <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
            {rol === 'ROLE_ADMIN' ? (
            <div className=''>
                 <button className="btn" onClick={iratras}><FontAwesomeIcon icon={faChevronLeft} size="lg"/></button>   
              <h2 className="mb-3 pt-4">Subir Archivo</h2>
            <form onSubmit={handleSubmit}>
                <div className=" mb-3 w-50">
                    <label className="form-label">Título</label>
                    <input type="text" className="form-control" placeholder="Titulo del Documento..." value={titulo} onChange={handleTituloChange} required />
                </div>
                <div className="mb-3 w-50">
                    <label className="form-label">Documento</label>
                    <input type="file" className="form-control" accept=".pdf, .doc, .docx" onChange={handleFileChange} required />
                </div>
                <button type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faArrowUpFromBracket}/> Subir</button>
            </form>
            </div>
            ):(
            <div className="px-5">
            <div class="alert alert-primary d-flex align-items-center" role="alert">
            <FontAwesomeIcon icon={faTriangleExclamation}/>
            <div className="ms-2">
                No tienes permisos para navegar por aqui 
            </div>
            </div>
                </div>
            )}
        </div>       
        </div>    
        </div>    
    );
}
export default UploadDocument;