import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import NavMenu from '../Layouts/NavMenu.js';
import Carrousel from '../Layouts/Carrousel.js';
import Footer from '../Layouts/Footer.js';
import '../Static/Styles/Style.css'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import '../Static/Styles/Style.css'
import Loader from '../Layouts/Loader.js';
import img from '.././Static/Img/imghm.jpeg';
import pcimg from '.././Static/Img/computer.jpg';

const Home = () => {
  document.title = 'Learning Java';

  const [adminDetails, setAdminDetails] = useState(null);
  const [usersDetails, setUsersDetails] = useState(null);
  const [error, setError] = useState(null);
  const rol = localStorage.getItem('role');
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [exercises,setExercises]=useState([]);
  const [foro,setForo]=useState([]);
  const [loading, setLoading] = useState(true);
  const [allDocuments,setAllDocuments]=useState([]);
  const baseUrl = rol === 'ROLE_USER' ? 'users' : 'admin';

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
    if (rol === 'ROLE_ADMIN') {
      fetchAdminDetails();
    } else if (rol === 'ROLE_USER') {
      fetchUsersDetails();
    }
    
    const obtenerCursosRecientes = async () => {
      try {
        const response = await axios.get('https://backend-learning-java.onrender.com/course/list/recent',{withCredentials:true});
        setCursos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los cursos recientes', error);
      }
    };

    const obtenerArchivos = async () => {
      try {
          const response = await axios.get(`https://backend-learning-java.onrender.com/${baseUrl}/documentacion/listar`, { withCredentials: true });
          setAllDocuments(response.data);
          setLoading(false);

      } catch (error) {
          console.error('Error al obtener la lista de archivos', error);
          setLoading(false);

      }
  };


  const fecthExercises = async () => {
    try {
        const response = await axios.get(`https://backend-learning-java.onrender.com/exercise/list`, { withCredentials: true });
        setExercises(response.data);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching course details', error);
    }

  };

  fecthExercises();

  obtenerArchivos();
      
    obtenerCursosRecientes();
    
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

  const formatDate = (date) => {
    const distance = formatDistanceToNow(date, { addSuffix: true, locale: es });

    if (distance.includes('hace alrededor de')) {
        return distance.replace('hace alrededor de ', 'hace ');
    }
    return distance;
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <NavMenu />
      </header>
      <main className="flex-grow-1">
        <Carrousel />
        <div className="mx-5">
          {loading ? (
            <div className='d-flex justify-content-center'>
              <Loader/>
            </div>
          ) : (
            <div className='mt-4'>
              <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
                <div>
                  <h1 className='fs-1 fw-bold mt-5  text-center'>Recientes</h1>
                  <h4 className='text-center fw-light fs-5 mb-5'>Enterate del<strong> Ultimo material</strong> subido a la plataforma</h4>
                  <div className="row row-cols-1 row-cols-md-3 g-4 my-3">
                    {cursos.map((curso) => {
                      const fecha = parseISO(curso.created);
                      const formattedDate = formatRelativeDate(fecha);
                      
                      const handleViewCourse = (id) => {
                        navigate(`/courseview/${id}`);
                      };
                      
                      return (
                        <div className="col" key={curso.id}>
                          <div className="card course-card h-100 mx-2">
                            <span className="position-absolute top-0 start-100 translate-middle p-2 badge rounded-pill primarycyan">
                              <span>Nuevo</span>
                            </span>
                            <img src={`data:image/jpeg;base64,${curso.coverImage}`} className="card-img-top w-100" alt={curso.title} />
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
        <div style={{width:'100%', height:'10%'}}>
          <img width={'100%'} className='my-5' src={img} alt='homeimg'></img>
        </div>
        <div className="d-flex ms-4 me-4">
          <div className="col bg-dark rounded-start">
            <img width={'100%'} height={'100%'} className='rounded-start' src={pcimg}></img>
          </div>
          <div className="col bg-secondary rounded-end pt-6">
            <h2 className='fw-light text-center text-light'>Resumen de la Web</h2>
            <h5 className='fw-light text-center text-light'>Datos de la pagina</h5>
            <div className='mx-5'>
              <div className='mx-5'>
                <div className='border w-5 mx-5'></div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="bg-light shadow rounded mx-5 my-5 p-4">
                  <span className="text-secondary fw-bold text-center">
                    Cursos en plataforma: 
                    <h2 className="text-center">
                      {cursos && cursos.length > 0 ? cursos.length : 'Datos no disponibles'}
                    </h2>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className="bg-light shadow rounded mx-5 my-5 p-4">
                  <span className="text-secondary fw-bold text-center">
                    Documentación: 
                    <h2 className="text-center">
                      {allDocuments && allDocuments.length > 0 ? allDocuments.length : 'Datos no disponibles'}
                    </h2>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="bg-light shadow rounded my-5 p-4" style={{ width: '35%', marginLeft: '35%' }}>
                  <span className="text-secondary fw-bold text-center">
                    Ejercicios: 
                    <h2 className="text-center">
                      {exercises && exercises.length > 0 ? exercises.length : 'Datos no disponibles'}
                    </h2>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="container mt-5">
          <h2 className="text-center fw-bold mb-5">Características Destacadas</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center fw-bold" style={{ marginBottom: '20px' }}>Acceso 24/7</h5>
                  <p className="card-text" style={{ textAlign: 'justify' }}>Disfruta de acceso a nuestra plataforma en cualquier momento, desde cualquier lugar, para aprender a tu propio ritmo.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center fw-bold" style={{ marginBottom: '20px' }}>Aprendizaje Autoguiado</h5>
                  <p className="card-text" style={{ textAlign: 'justify' }}>Explora materiales para que avances según tus propios objetivos y necesidades, sin presión de tiempo.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center fw-bold" style={{ marginBottom: '20px' }}>Diversidad de Recursos</h5>
                  <p className="card-text" style={{ textAlign: 'justify' }}>Encuentra gran variedad de materiales como ejercicios y documentación para complementar tu aprendizaje.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
