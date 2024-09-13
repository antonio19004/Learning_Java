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
import Forum from './Forum/Forum.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMessage, faSearch, faThumbTack, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

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

      } catch (error) {
          console.error('Error al obtener la lista de archivos', error);

      }
  };


  const fecthExercises = async () => {
    try {
        const response = await axios.get(`https://backend-learning-java.onrender.com/exercise/list`, { withCredentials: true });
        setExercises(response.data);
    } catch (error) {
        console.error('Error fetching course details', error);
    }

};

const fetchForo = () => {
  axios.get('https://backend-learning-java.onrender.com/forum', { withCredentials: true })
      .then(response => {
          setForo(response.data);
          setLoading(false)
      })
      .catch(error => console.error(error));
};


fetchForo();

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

  const processForumData = (forum) => {
    const formattedDate = formatDate(forum.fechaPublicacion);
    const lastModifier = forum.ultimoModificador || "Sin modificaciones";
    const isFixed = forum.fixed;
    const isHidden = forum.hidden;
    
    return {
        ...forum,
        formattedDate,
        lastModifier,
        isFixed,
        isHidden
    };
};


  const renderTableBody = () => {
    return foro.map((forum) => {
        const { formattedDate, lastModifier, isFixed, isHidden } = processForumData(forum);
        const pinIconColor = isFixed ? 'dark' : 'transparent';
        const textStyle = isHidden ? { color: 'darkgray', textDecoration: 'line-through' } : {};

        return (
            <tr key={forum.id} className={`forum-row ${isHidden ? 'hidden-row' : ''}`}>
                <td>
                    <Link to={`/forum-topic/${forum.id}`} className='link-foro' style={textStyle}>
                        <FontAwesomeIcon icon={faMessage} className="icon-left" style={{ marginRight: '10px' }} />
                        {forum.titulo}
                    </Link>
                </td>
                <td style={{ ...textStyle, textIndent: '10px' }}>{forum.respuestasCount}</td>
                <td style={{ ...textStyle, textAlign: 'center' }}>
                    {lastModifier} - {formattedDate}
                    {isFixed && (
                        <FontAwesomeIcon icon={faThumbTack} style={{ marginLeft: '10px', color: pinIconColor, transform: 'rotate(40deg)' }} />
                    )}
                </td>
            </tr>
        );
    });
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
              <h1 className='fs-1 fw-light mt-5  text-center'>Recientes</h1>
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
                      <div className="card h-100 mx-2">
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
          <img width={'100%'} className='my-5'  src={img} alt='homeimg'></img>
      </div>

        <div className='my-5'>
        <div className='m-3'>
            <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
                {loading ? (
                    <center><div className='d-flex justify-content-center'>
                        <Loader />
                    </div></center>
                ) : (
                    <div>
                        <h2 className='fw-bold mb-4'><FontAwesomeIcon icon={faVolumeHigh} style={{ marginRight: '10px', transform: 'rotate(-40deg)' }} /> Foro de Discusión</h2><br />
                        <div className="table-responsive rounded">
                            <table className='table table-foro'>
                                <thead>
                                    <tr>
                                        <th>Tema</th>
                                        <th style={{ textIndent: '5px' }}><FontAwesomeIcon icon={faComments} style={{ width:'25px', height: '25px'}} /></th>
                                        <th style={{ textAlign: 'center' }}>Última Modificación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableBody()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            </div>
            </div>
        </div>

      <div className="d-flex ms-4 me-4">
      <div className="col bg-dark rounded-start">
        <img width={'100%'} height={'100%'} className='rounded-start' src={pcimg}></img>
      </div>
      <div className="col bg-secondary rounded-end pt-6">
        <h2 className='fw-light text-center text-light'>Resumen de la Web</h2>
        <h5 className='fw-light text-center text-light'>Datos de la pagina</h5>
        <div className='mx-5'><div className='mx-5'><div className='border w-5 mx-5'></div></div></div>
        <div className='row'>
          <div className='col'>
        <div className='bg-light shadow rounded mx-5 my-5 p-4'>
              <span className='text-secondary fw-bold text-center'>Cursos en plataforma: <h2 className='text-center'>{cursos.length}</h2></span>
        </div>
        </div>

        <div className='col'>
        <div className='bg-light shadow rounded mx-5 my-5 p-4'>
              <span className='text-secondary fw-bold text-center'>Documentacion: <h2 className='text-center'>{allDocuments.length}</h2></span>
        </div>
        </div>
        </div>


        <div className='row'>
          <div className='col'>
        <div className='bg-light shadow rounded my-5 p-4' style={{width:'35%', marginLeft:'35%'}}>
              <span className='text-secondary fw-bold text-center'>Ejercicios: <h2 className='text-center'>{exercises.length}</h2></span>
        </div>
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
