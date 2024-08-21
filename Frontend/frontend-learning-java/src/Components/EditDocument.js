import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faFloppyDisk, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import '../Static/Styles/Style.css';
import { useParams,useNavigate } from "react-router-dom";

const EditDocument = () => {
    const { id } = useParams();  // Obtener el id del documento desde la URL
    const [file, setFile] = useState(null);
    const [titulo, setTitulo] = useState("");
    const rol = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocumentData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/documentacion/get/${id}`, { withCredentials: true });
                setTitulo(response.data.titulo);
                // Aquí podrías manejar la carga del archivo si fuera necesario, pero normalmente los archivos no se prellenan
            } catch (error) {
                console.error('Error al obtener los datos del documento', error);
            }
        };

        fetchDocumentData();
    }, [id]);

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
            const response = await axios.put(`http://localhost:8080/admin/documentacion/edit/${id}`, formData, { withCredentials: true }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Archivo actualizado con éxito');
            navigate('/panel/document');
        } catch (error) {
            console.error('Error al actualizar el archivo', error);
            alert('Error al actualizar el archivo');
        }
    };

    const iratras=()=>{
        navigate('/panel/document');
    }

    return (
        <div className="px-5">
            {rol === 'ROLE_ADMIN' ? (
                <div className='border border-2 p-5 pt-2 rounded'>
                    <button className="btn rounded" onClick={iratras}><FontAwesomeIcon icon={faCaretLeft}/> Atras</button> 
                    <h2 className="mb-3 pt-4">Editar Archivo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 w-50">
                            <label className="form-label">Título</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Titulo del Documento..." 
                                value={titulo} 
                                onChange={handleTituloChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3 w-50">
                            <label className="form-label">Documento (opcional)</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                accept=".pdf, .doc, .docx" 
                                onChange={handleFileChange} 
                            />
                            <small className="form-text text-muted">
                                *Si no seleccionas un nuevo archivo, el documento actual se mantendrá sin cambios.
                            </small>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faFloppyDisk} /> Guardar Cambios
                        </button>
                    </form>
                </div>
            ) : (
                <div className="px-5">
                    <div className="alert alert-primary d-flex align-items-center" role="alert">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <div className="ms-2">
                            No tienes permisos para navegar por aquí
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditDocument;
