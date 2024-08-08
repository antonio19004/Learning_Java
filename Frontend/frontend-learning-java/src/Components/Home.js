import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavMenu from '../Layouts/NavMenu.js';
import Carrousel from '../Layouts/Carrousel.js';
import Footer from '../Layouts/Footer.js';
import '../Static/Styles/Style.css'

const Home = () => {
    document.title = 'Home';
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
        <div className="d-flex flex-column min-vh-100">
      <header>
        <NavMenu />
      </header>
      <main className="flex-grow-1">
        <Carrousel />
        <h1 className='fs-1 fw-light my-5 text-center'>Recientes</h1>
        <div className="row row-cols-1 row-cols-md-3 g-4 mx-3 my-3">
          <div className="col">
            <div className="card h-100">
              <img src="..." className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <img src="..." className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <img src="..." className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    );
};

export default Home;
