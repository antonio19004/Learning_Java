import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavMenu from '../Layouts/NavMenu.js';
import Carrousel from '../Layouts/Carrousel.js';
import Footer from '../Layouts/Footer.js';
import '../Static/Styles/Style.css'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import '../Static/Styles/Style.css'
import Loader from '../Layouts/Loader.js';

const Home = () => {
    document.title = 'Home';
    const [adminDetails, setAdminDetails] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const rol = localStorage.getItem('role');
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);


    const formatRelativeDate = (date) => {
      const distance = formatDistanceToNow(date, { addSuffix: true, locale: es });
  
      if (distance.includes('hace alrededor de')) {
          return distance.replace('hace alrededor de ', 'hace ');
      }
      if (distance.includes('hace menos de')) {
        return distance.replace('hace menos de ', 'hace ');
    }
      return distance;
  };

  



    useEffect(() => {
      if (!username) {
        navigate('/login');
      } else if (rol === 'ROLE_ADMIN') {
        fetchAdminDetails();
      } else if (rol === 'ROLE_USER') {
        fetchUsersDetails();
      }

      const obtenerCursosRecientes = async () => {
        try {
          // Reemplaza la URL con la URL correcta de tu backend
          const response = await axios.get('http://localhost:8080/course/list/recent',{withCredentials:true});
          setCursos(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener los cursos recientes', error);
        }
      };
      
      obtenerCursosRecientes();

    }, [username, rol, navigate]);

    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/details', { withCredentials: true });
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
        const response = await axios.get('http://localhost:8080/users/details', { withCredentials: true });
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

      

    return (
      <div className="d-flex flex-column min-vh-100">
        <header>
          <NavMenu />
        </header>
        <main className="flex-grow-1">
          <Carrousel />
            <div className="mx-4">
            {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader/>
                    </div>
                ) : (
           <div className='p-4'>       
             <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
             <div>
          <h1 className='fs-1 fw-light my-5 text-center'>Recientes</h1>
          <div className="row row-cols-1 row-cols-md-3 g-4 my-3">
          {cursos.map((curso) => {
            const fecha = parseISO(curso.created);
            const formattedDate = formatRelativeDate(fecha);

            const handleViewCourse = (id) => {
              navigate(`/courseview/${id}`);
            };


  return (
    <div className="col" key={curso.id}>
      <div className="card h-100 mx-2">
      <span className="position-absolute top-0 start-100 translate-middle p-2 badge rounded-pill primarycyan">
        <span>Nuevo</span>
      </span>
        <img
          src={`data:image/jpeg;base64,${curso.coverImage}`}
          className="card-img-top w-100"
          alt={curso.title}
        />
        <div className="card-body">
          <h5 className="card-title">{curso.title}</h5>
          <p className="card-text">{curso.description}</p>
          <button onClick={()=>handleViewCourse(curso.id)} className="btn btn-primary">Ver curso</button>
        </div>
        <div className="card-footer">
          <small className="text-muted">Subido: {formattedDate}</small>
        </div>
      </div>
    </div>
  );
})}
      </div>
      </div>
      </div>
      </div>
      )}
      </div>
        </main>
        <Footer />
      </div>
    );
};

export default Home;
