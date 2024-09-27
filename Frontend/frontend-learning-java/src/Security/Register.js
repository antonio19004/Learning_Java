import React, { useState,useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faCalendar, faImage } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Register() {
    document.title = 'Register';

    const [imagenPerfil, setImagenPerfil] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

    const clearImage = () => {
        setImagenPerfil(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("La contraseña no coincide");
            return;
        }
        if (!nombre || !apellido || !fechaNacimiento || !email || !username || !password || !confirmPassword) {
            setErrorMessage("Por favor, llena todos los campos.");
            return;
        }
        if (!acceptTerms) {
            setErrorMessage("Debes aceptar los términos para poder registrarte");
            return;
        }

        const formData = new FormData();
        formData.append('imagenPerfil', imagenPerfil);
        formData.append('nombre', nombre);
        formData.append('apellido', apellido);
        formData.append('fechaNacimiento', fechaNacimiento);
        formData.append('email', email);
        formData.append('user', username);
        formData.append('password', password);
        formData.append('acceptTerms', acceptTerms);

        try {
            const response = await axios.post('https://backend-learning-java.onrender.com/register/add-user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
            } else {
                console.error('Ocurrió un error en el registro: ', error);
                setErrorMessage('Error en el registro. Inténtelo de nuevo');
            }
        }
    };


    

    return (
        <div className='container-fluid mt-4'>
            <div className='row justify-content-center'>
                <div className='col-12 col-md-10 col-lg-8'>
                    <div className='shadow bg-light px-4 pb-5 my-4 rounded'>
                        <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
                            {errorMessage && (
                                <div className="alert alert-danger w-100 p-1 mt-4" role="alert">
                                    <p className="text-danger text-center">{JSON.stringify(errorMessage)}</p>
                                </div>
                            )}
                            <h2 className='fw-bold'>Crea una nueva cuenta</h2>
                            <br />
                            <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: '600px', width: '100%' }}>
                                <div className="col-12 mb-3 text-center">
                                    {imagePreview && (
                                        <div className="position-relative" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                            <img src={imagePreview} alt="Imagen de perfil" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }} />
                                            <button type="button" onClick={clearImage} className="btn btn-secondary ms-2" style={{ top: '-10px', right: '-10px', width: '35px', height: '35px', borderRadius: '50%' }}>X</button>
                                        </div>
                                    )}
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faImage} />
                                        </span>
                                        <input ref={fileInputRef} className='form-control' type="file" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                        <input className='form-control' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Nombre' />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                        <input className='form-control' type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder='Apellido' />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </span>
                                        <input className='form-control' type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </span>
                                        <input className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                        <input className='form-control' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Usuario' />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group position-relative">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <input className='form-control' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña' />
                                        <span className="position-absolute" onClick={toggleShowPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-group position-relative">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <input className='form-control' type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirmar contraseña' />
                                        <span className="position-absolute" onClick={toggleShowConfirmPassword} style={{ color: 'gray', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-check d-flex justify-content-center">
                                        <input className='form-check-input me-2' type="checkbox" id="acceptTerms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                                        <label className="form-check-label" for="acceptTerms">Acepto que la página maneje mi información</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex justify-content-center">
                                        <button className='btn btn-dark' type="submit">Registrarse</button>
                                    </div>
                                </div>
                                <h5 className='d-flex justify-content-center fw-light'>Si ya tienes una cuenta</h5>
                                <h5 className='d-flex justify-content-center fw-bold'><a className='text-decoration-none text-dark hover:text-secondary' href='/login'>Inicia Sesión</a></h5>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
