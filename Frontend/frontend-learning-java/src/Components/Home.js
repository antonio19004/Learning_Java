import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [adminDetails, setAdminDetails] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const rol = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate('/login');
        } else if (rol === 'ROLE_ADMIN') {
            fetchAdminDetails();
        } else if (rol === 'ROLE_USER') {
            fetchUsersDetails();
        }
    }, [username, rol, navigate]);

    const fetchAdminDetails = async () => {
        console.log('Fetching admin details...');
        try {
            const response = await axios.get('http://localhost:8080/admin/details', { withCredentials: true });
            console.log('Admin details fetched successfully:', response.data);
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
        console.log('Fetching Users details...');
        try {
            const response = await axios.get('http://localhost:8080/users/details', { withCredentials: true });
            console.log('Users details fetched successfully:', response.data);
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

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
            localStorage.removeItem('username');
            localStorage.removeItem('rol');
            navigate('/login');
        } catch (error) {
            console.error('Error durante el cierre de sesión', error);
        }
    };

    
    return (
        <div>
            <h1>Bienvenido, {username}!</h1>
            <p>Has iniciado sesión exitosamente.</p>
            {rol === 'ROLE_ADMIN' ? (
                <div>
                    <h2>Panel de Administrador</h2>
                    {adminDetails ? (
                        <div>
                            <p><strong>Foto de perfil:</strong></p>
                            <p><strong>Nombre Completo:</strong> {adminDetails.nombre} {adminDetails.apellido}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {adminDetails.fechaNacimiento}</p>
                            <p><strong>Edad:</strong> {adminDetails.edad}</p>
                            <p><strong>Email:</strong> {adminDetails.email}</p>
                        </div>
                    ) : (
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    )}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <div>
                    <h2>Panel de Usuario</h2>
                    {usersDetails ? (
                        <div>
                            <p><strong>Foto de perfil:</strong></p>
                            <p><strong>Nombre Completo:</strong> {usersDetails.nombre} {usersDetails.apellido}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {usersDetails.fechaNacimiento}</p>
                            <p><strong>Edad:</strong> {usersDetails.edad}</p>
                            <p><strong>Email:</strong> {usersDetails.email}</p>
                        </div>
                    ) : (
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    )}
                     {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
