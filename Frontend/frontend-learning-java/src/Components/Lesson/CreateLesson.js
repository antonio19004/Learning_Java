import React, { useState,useEffect} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

function CreateLesson() {

  const {id}=useParams();
  const navigate =useNavigate();
  console.log("curso id"+id);
  const [courses, setCourses] = useState([]);
    
  useEffect(() => {
    axios.get('https://backend-learning-java.onrender.com/course/list',{withCredentials:true}) 
      .then(response => { 
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const [lesson, setLesson] = useState({
    title: '',
    description: '',
    video: '',
    duration: '',
    order: '',
    idCourse:id,
    progress:0,
    completed:false
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({
      ...lesson,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-learning-java.onrender.com/lesson/create',lesson,{withCredentials:true});
      console.log(response.data);
      alert('Leccion creada con exito');
      navigate('/panel/courses');
      
    } catch (error) {
      console.error(error);
    }
  };
  
  function extractYoutubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  return (
    <div>
      <a href='/panel/courses' className='text-blue-dark text-decoration-none'>
        <FontAwesomeIcon icon={faChevronLeft} size='lg' />
      </a>
      <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
        <h2 className='mb-4'><FontAwesomeIcon icon={faChalkboardUser}/>  Crear Nueva Lección</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label>Título</label>
                <input type="text" className="form-control" name="title" value={lesson.title} onChange={handleChange} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Duración (minutos)</label>
                <input type="number" className="form-control" name="duration" value={lesson.duration} onChange={handleChange} required min="1" />
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Descripción</label>
                <textarea className="form-control" name="description" value={lesson.description} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label>URL Video  (<FontAwesomeIcon icon={faYoutube} style={{color:'red'}}/>YouTube)</label>
                <input type="text" className="form-control" name="video" value={lesson.video} onChange={handleChange} required />
              </div>
              <div>
                {lesson?.video ? (
                  <img src={`https://img.youtube.com/vi/${extractYoutubeId(lesson.video)}/hqdefault.jpg`} alt="Video Miniatura" width="100" height="80" className="mb-3 border rounded" />
                ) : (
                  <p className='text-danger'>No hay video</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Curso</label>
                <input type="text" className="form-control text-muted" name="idCourse" value={lesson.idCourse} disabled style={{ userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()} />
              </div>
            </div>
          </div>
          <div className="row mb-3 d-none">
            <div className="col-md-6">
              <div className="form-group">
                <input type="hidden" className="form-control" name="progress" value={lesson.progress} onChange={handleChange} disabled required />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button type="submit" className="btn btn-success mt-4">
                Guardar lección
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLesson;
