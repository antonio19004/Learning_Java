import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { faChalkboard, faChevronLeft, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

function EditLessonForm() {
    const { id } = useParams();
    console.log("curse id:  "+id);
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr]= useState('');
    

    const [lesson, setLesson] = useState({
        title: '',
        description: '',
        video: '',
        duration: '',
        order: '',
        idCourse:'',
        progress:0,
        completed:false
    });

    
    useEffect(() => {
        const fetchLessonDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/lesson/select/${id}`, { withCredentials: true });
                setLesson(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos de lección:", error);
                setLoading(false); 
            }
        };
        fetchLessonDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson({ ...lesson, [name]: value });
    };
    
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/lesson/update/${id}`, lesson, {
                withCredentials: true,
            });
            goBack();
        } catch (error) {
            console.error("Error al editar lección:", error);
            setErr("No se pudo Completar la Actualizacion!.");
        }
    };
    

    const goBack = () => {
        navigate(-1);
    };


    function extractYoutubeId(url) {
        const regExp = /^.*(youtu\.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    

    return (
        <div>

                {err && (
                    <div className="alert alert-danger alert-dismissible fade show w-50 p-1 mx-auto mt-4"  role="alert">
                        <p className="text-danger text-center">{err}</p>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
              <a  onClick={goBack} className='text-blue-dark tex-decoration-none cursor-pointer'><FontAwesomeIcon icon={faChevronLeft} size='lg'/></a>
        <div className=''>
            <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
                <h2 className='mb-4'><FontAwesomeIcon icon={faChalkboard}/>  Editar Lección</h2>
                <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={lesson.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Duración (minutos)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="duration"
                    value={lesson.duration}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>
      
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={lesson.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
      
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                <label>URL Video  (<FontAwesomeIcon icon={faYoutube} style={{color:'red'}}/>YouTube)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="video"
                    value={lesson.video}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                                                {lesson?.video ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${extractYoutubeId(lesson.video)}/hqdefault.jpg`}
                                                        alt="Video Miniatura"
                                                        width="100"
                                                        height="80"
                                                        className="mb-3 border rounded"
                                                    />
                                                ) : (
                                                    <p className='text-danger'>No hay video</p>
                                                )}
                                            </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Curso</label>
                  <input
                    type="text"
                    className="form-control text-muted"
                    name="idCourse"
                    value={lesson.idCourse}
                    disabled
                    style={{ userSelect: 'none' }}
                    onContextMenu={(e) => e.preventDefault()} 
                  />
                </div>
              </div>
            </div>
      
            <div className="row mb-3 d-none">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="hidden"
                    className="form-control"
                    name="progress"
                    value={lesson.progress}
                    onChange={handleChange}
                    disabled
                    required
                  />
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
        </div>
    );
}

export default EditLessonForm;
