import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCalendar, faImage } from '@fortawesome/free-solid-svg-icons';
import '../Static/Styles/Profile.css';
import UserImg from '../Static/Img/User.png';

const Profile = ({ showModal, handleClose }) => {
    
    const [adminDetails, setAdminDetails] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [imagenPerfil, setImagenPerfil] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isEditEnabled, setIsEditEnabled] = useState(false);
    const username = localStorage.getItem('username');
    const rol = localStorage.getItem('role');
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(UserImg);

    useEffect(() => {
        if (rol === 'ROLE_ADMIN') {
            fetchAdminDetails();
        } else if (rol === 'ROLE_USER') {
            fetchUsersDetails();
        }
    }, [rol, navigate]);

    const fetchAdminDetails = async () => {
        try {
            const response = await axios.get('https://backend-learning-java.onrender.com/admin/details', { withCredentials: true });
            setAdminDetails(response.data);
        } catch (error) {
            console.error('Error al obtener los detalles del administrador', error);
            setError('Error al obtener los detalles del administrador');
            if (error.response && error.response.status === 403) {
                setError('No tienes permiso para acceder a esta ruta');
            } else {
                setError('Error al obtener los detalles del administrador');
            }
        }
    };

    const fetchUsersDetails = async () => {
        try {
            const response = await axios.get('https://backend-learning-java.onrender.com/users/details', { withCredentials: true });
            setUsersDetails(response.data);
        } catch (error) {
            console.error('Error al obtener los detalles del Usuario', error);
            setError('Error al obtener los detalles del Usuario');
            if (error.response && error.response.status === 403) {
                setError('No tienes permiso para acceder a esta ruta');
            } else {
                setError('Error al obtener los detalles del Usuario');
            }
        }
    };

    const profileDetails = (details) => {
        const img = details.imagenPerfil ? `data:image/jpeg;base64,${details.imagenPerfil}` : profileImage;

        const fecha = new Date(details.fechaNacimiento);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = fecha.toLocaleDateString('es-ES', options);
    
        return (
            rol === 'ROLE_ADMIN' ? (
                <div className="row align-items-center">
                    <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
                        <img src={img} alt="Perfil" className="img-fluid rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px', marginLeft: '30%' }} />
                    </div>
                    <div className="col-12 col-md-8">
                        <div style={{ marginLeft: '20px' }}>
                            <p><strong>Nombre:</strong> {details.nombre} {details.apellido}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {formattedDate}</p>
                            <p><strong>Edad:</strong> {details.edad}</p>
                            <p><strong>Email:</strong> {details.email}</p>
                            <p><strong>Nombre de Usuario:</strong> {details.user}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row align-items-center">
                    <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
                        <img src={img} alt="Perfil" className="img-fluid rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px', marginLeft: '30%' }} />
                    </div>
                    <div className="col-12 col-md-8">
                        <div style={{ marginLeft: '20px' }}>
                            <p><strong>Nombre:</strong> {details.nombre} {details.apellido}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {formattedDate}</p>
                            <p><strong>Edad:</strong> {details.edad}</p>
                            <p><strong>Email:</strong> {details.email}</p>
                            <p><strong>Nombre de Usuario:</strong> {details.user}</p>
                        </div>
                    </div>
                </div>
            )
        );
    };

    const close = () => {
        setIsEditEnabled(false);
        handleClose();
    }

    const handleToggleEdit = () => {
        setIsEditEnabled(!isEditEnabled);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagenPerfil(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!(rol === 'ROLE_ADMIN' ? adminDetails?.nombre : usersDetails?.nombre) ||
            !(rol === 'ROLE_ADMIN' ? adminDetails?.apellido : usersDetails?.apellido) ||
            !(rol === 'ROLE_ADMIN' ? adminDetails?.fechaNacimiento : usersDetails?.fechaNacimiento) ||
            !(rol === 'ROLE_ADMIN' ? adminDetails?.email : usersDetails?.email)) {
                
                setErrorMessage("Por favor, llena todos los campos.");
                return;
        }

        const formData = new FormData()
        if (imagenPerfil) {
            formData.append('imagenPerfil', imagenPerfil);
        } else {
            formData.append('imagenPerfil', rol === 'ROLE_ADMIN' ? adminDetails?.imagenPerfil : usersDetails?.imagenPerfil);
        }
        formData.append('nombre', rol === 'ROLE_ADMIN' ? adminDetails?.nombre : usersDetails?.nombre);
        formData.append('apellido', rol === 'ROLE_ADMIN' ? adminDetails?.apellido : usersDetails?.apellido);
        formData.append('fechaNacimiento', rol === 'ROLE_ADMIN' ? adminDetails?.fechaNacimiento : usersDetails?.fechaNacimiento);
        formData.append('email', rol === 'ROLE_ADMIN' ? adminDetails?.email : usersDetails?.email);
        formData.append('username', username);

        try {
            const url = rol === 'ROLE_ADMIN' ? 'http://localhost:8080/admin/update-profile' : 'http://localhost:8080/users/update-profile' 
            const response = await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setIsEditEnabled(false);
                window.location.reload();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error('Ocurrió un error en la actualización de datos: ', error);
                setErrorMessage('Error en la actualización de datos. Inténtelo de nuevo');
            }
        }
    };

    const handleUpdatePassword = async () => {
        navigate('/update-password')
    }

    return(
        <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} className="profile-modal">
            <Modal.Header>
                <Modal.Title>Perfil de Usuario</Modal.Title>
                <Button variant="close" onClick={close}></Button>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex align-items-center mb-3">
                    <span>Editar</span>
                    <Form.Check type="switch" id="edit-switch" className="ms-2" checked={isEditEnabled} onChange={handleToggleEdit} />
                </div>
                {isEditEnabled ? (
                    <form onSubmit={handleUpdate} className="row g-3">
                        <div className="col-12 mb-3 text-center">
                            <center>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Imagen de Perfil" className="img-fluid rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }} />
                                ) : (
                                    rol === 'ROLE_ADMIN' ? (
                                        adminDetails?.imagenPerfil && (
                                            <img src={`data:image/jpeg;base64,${adminDetails.imagenPerfil}`} alt="Imagen de Perfil" className="img-fluid rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }} />
                                        )
                                    ) : (
                                        usersDetails?.imagenPerfil && (
                                            <img src={`data:image/jpeg;base64,${usersDetails.imagenPerfil}`} alt="Imagen de Perfil" className="img-fluid rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }} />
                                        )
                                    )
                                )}
                            </center><br />
                            <div className="input-group mt-3">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faImage} />
                                </span>
                                <input className='form-control' type="file" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div><br />
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                <input className="form-control" type="text" value={rol === 'ROLE_ADMIN' ? adminDetails?.nombre : usersDetails?.nombre} onChange={(e) => { 
                                    if (rol === 'ROLE_ADMIN') {
                                        setAdminDetails({ ...adminDetails, nombre: e.target.value });
                                    } else {
                                        setUsersDetails({ ...usersDetails, nombre: e.target.value });
                                    }
                                }} placeholder="Nombre" />
                            </div>
                        </div><br />
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                <input className="form-control" type="text" value={rol === 'ROLE_ADMIN' ? adminDetails?.apellido : usersDetails?.apellido} onChange={(e) => {
                                    if (rol === 'ROLE_ADMIN') {
                                        setAdminDetails({ ...adminDetails, apellido: e.target.value });
                                    } else {
                                        setUsersDetails({ ...usersDetails, apellido: e.target.value });
                                    }
                                }} placeholder="Apellido" />
                            </div>
                        </div><br />
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faCalendar} />
                                </span>
                                <input className="form-control" type="date" value={rol === 'ROLE_ADMIN' ? adminDetails?.fechaNacimiento : usersDetails?.fechaNacimiento} onChange={(e) => {
                                    if (rol === 'ROLE_ADMIN') {
                                        setAdminDetails({ ...adminDetails, fechaNacimiento: e.target.value });
                                    } else {
                                        setUsersDetails({ ...usersDetails, fechaNacimiento: e.target.value });
                                    }
                                }} />
                            </div>
                        </div><br />
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <input className="form-control" type="email" value={rol === 'ROLE_ADMIN' ? adminDetails?.email : usersDetails?.email} onChange={(e) => {
                                    if (rol === 'ROLE_ADMIN') {
                                        setAdminDetails({ ...adminDetails, email: e.target.value });
                                    } else {
                                        setUsersDetails({ ...usersDetails, email: e.target.value });
                                    }
                                }} placeholder="Email" />
                            </div>
                        </div><br />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </form>
                ):(
                    rol === 'ROLE_ADMIN' ? (
                        <div>
                            {adminDetails ? profileDetails(adminDetails) : (
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    ) : (
                        <div>
                            {usersDetails ? profileDetails(usersDetails) : (
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    )
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleUpdatePassword}>Cambiar Contraseña</Button>
                {isEditEnabled && <Button variant="secondary" onClick={handleUpdate}>Guardar Cambios</Button>}
            </Modal.Footer>
        </Modal>
    );
}

export default Profile;
