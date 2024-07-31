import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Welcome() {

    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [adminDetails, setAdminDetails] = useState(null);
    const rol = localStorage.getItem('rol');
    const [error, setError] = useState('');

    useEffect(() => {
        
        if (!username) {
            navigate('/login');
        } else if (rol === 'ROLE_ADMIN') {
            fetchAdminDetails();
        }
    }, [username, rol ,navigate]);


    const fetchAdminDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/Details');
            setAdminDetails(response.data);
        } catch (error) {
            console.error('Error al obtener los detalles del administrador', error);
            setError('Error al obtener los detalles del administrador');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout');
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
                    { adminDetails?(
                        <div>
                            <p><strong>Foto de perfil:</strong></p>
                            <p><strong>Nombre Completo:</strong>{adminDetails.nombre}{adminDetails.apellido}</p>
                            <p><strong>Fecha de Nacimiento:</strong>{adminDetails.fechaNacimiento}</p>
                            <p><strong>Email:</strong>{adminDetails.email}</p>
                        </div>
                    ):(
                        <p>Cargando detalles...</p>
                    )}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <div>
                    <h2>Panel de Usuario</h2>
                    <p>Aquí van las funcionalidades del usuario.</p>
                    {/**/}
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Welcome;