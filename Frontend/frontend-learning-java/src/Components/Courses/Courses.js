import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faChalkboardUser, faChartLine, faCircle, faCircleInfo, faClock, faEdit, faFlagCheckered, faGraduationCap, faList, faMagnifyingGlassChart, faNotdef, faSitemap, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../Layouts/Loader';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import Swal from 'sweetalert2';

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/course/list',{withCredentials:true});
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);


    const handleCardClick = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8080/course/${courseId}/lessons`, { withCredentials: true });
            setSelectedCourse(response.data.course);
            setLessons(response.data.lessons); 
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching course details', error);
        }
    };
    
    const handleDeleteCourse = async (courseId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás recuperar este Curso después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/course/delete/${courseId}`, { withCredentials: true });
                Swal.fire(
                    'Eliminado!',
                    'El curso ha sido eliminado.',
                    'success'
                );
                setCourses(courses.filter(course => course.id !== courseId));
            } catch (error) {
                console.error('Error al eliminar el curso', error);
                Swal.fire(
                    'Error!',
                    'No se pudo eliminar el curso.',
                    'error'
                );
            }
        }
    };





    const handleClose = () => {
        setShowModal(false);
        setSelectedCourse(null);
    };

    const handleCourseForm = () => {
        navigate(`/panel/coursesForm`);
    };


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
  
    const formatDate = (dateString) => {
        const fecha = parseISO(dateString);
        return formatRelativeDate(fecha, new Date());
    };


    const handleEditCourse = (id) => {
        navigate(`/panel/edit-course/${id}`);
      };

      const handleNewLesson = (id) => {
        navigate(`/panel/lessonForm/course/${id}`);
      };

      const handleLessons = (id) => {
        navigate(`/panel/lessons/course/${id}`);
      };

    return (
        
        <div className="">
               {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader />
                    </div>
                ) : (
            <div>
                 <div className='row'>
                    <div > 
                    <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
                       <h2><FontAwesomeIcon icon={faGraduationCap}/>  Cursos</h2>
                       <p>Creacion de Curso - Asignación de Lecciones</p>
                       <buttom className='btn btn-success' onClick={handleCourseForm}>
                          Nuevo Curso
                       </buttom>
                       </div>
                       </div>
                    </div>   

    <div className='row'>
        <div>
        <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
            <h2> <FontAwesomeIcon icon={faList}/>  Lista de Cursos</h2>
           

                            {courses && courses.length > 0 ? (
                                    courses.map((course) => (
                                    <div className="cursor-pointer d-flex justify-content-between p-3 mt-4 shadow bg-light rounded"
                                    onClick={() => handleCardClick(course.id)}   key={course.id}>
                                        
                                            <a className='fs-5 text-decoration-none text-blue-dark'><FontAwesomeIcon icon={faBookmark}/>  {course.title}</a>

                                            <div className='d-flex justify-content-between'>
                                            <div onClick={(event) => { event.stopPropagation(); handleDeleteCourse(course.id); }}><FontAwesomeIcon className='me-2' icon={faTrash} style={{color:'red',}}/></div>
                                            <div onClick={(event) => { event.stopPropagation(); handleEditCourse(course.id); }}><FontAwesomeIcon icon={faEdit} style={{color:'#ebb00f',}}/></div>
                                            </div>
                                      
                                    </div>
                                    ))):(
                                        <div class="alert alert-primary d-flex flex-wrap" role="alert">
                                        <FontAwesomeIcon className='mt-1' icon={faNotdef}/><p className='ms-2'>No Hay Elementos</p>
                                      </div>
                                    )
                                }


        {selectedCourse && (
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4><FontAwesomeIcon icon={faCircleInfo}/>  Detalles del Curso</h4>
                        <button type="button" className='btn-close' onClick={handleClose} data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                     <div className='d-flex justify-content-between'>
                     <div>      
                    <h2 className="modal-title">{selectedCourse?.title}</h2>
                    <p>{selectedCourse?.description}</p>
                    </div>
                    <img
                                            src={`data:image/jpeg;base64,${selectedCourse?.coverImage}`}
                                            alt={selectedCourse?.title}
                                            width="100"
                                            height="80"
                                            className='mb-3 border rounded'
                                        />
                    </div>
                    <hr />
                    <p><span className='fs-6 fw-bold'><FontAwesomeIcon icon={faCalendarDays} size='sm'/>   Ultima Actualización:</span>  {formatDate(selectedCourse?.lastUpdate)}</p>
                    <p><span className='fs-6 fw-bold'><FontAwesomeIcon icon={faClock} size='sm'/>  Duración:</span>  {selectedCourse?.duration} Horas(s)</p>
                    <p><span className='fs-6 fw-bold'><FontAwesomeIcon icon={faChartLine} size='sm'/>  Nivel:</span>  {selectedCourse?.level}</p>

                  

                    <span className='fs-6 fw-bold'>
        <FontAwesomeIcon icon={faFlagCheckered} size='sm' /> Objetivos:
      </span>
      <ol>
        {selectedCourse?.objectives?.map((objective) => (
          <li>{objective}</li>
        ))}
      </ol>

      <span className='fs-6 fw-bold'>
        <FontAwesomeIcon icon={faMagnifyingGlassChart} size='sm' /> Contenido:
      </span>
      <ol>
        {selectedCourse?.content?.map((item) => (
          <li>{item}</li>
        ))}
      </ol>

      <span className='fs-6 fw-bold'>
        <FontAwesomeIcon icon={faSitemap} size='sm' /> Temas:
      </span>
      <ol>
        {selectedCourse?.topic?.map((topic) => (
          <li> {topic}</li>
        ))}
      </ol>

                    <hr />
                    <h6><FontAwesomeIcon icon={faChalkboardUser} size='sm'/>  Lecciones</h6>
                    <ul>
                        {lessons && lessons.length > 0 ? (
                            lessons.map((lesson) => (
                                <li key={lesson.id}>
                                    {lesson.title}
                                </li>
                            ))
                        ) : (
                            <p className='text-muted fs-sm'>No hay lecciones disponibles.</p>
                        )}
                    </ul>
                <div>
                <button type="button" className="btn btn-success mt-4 me-2" onClick={(event) => { event.stopPropagation(); handleLessons(selectedCourse?.id); }}>Lecciones</button>
                <button type="button" className="btn btn-primary mt-4" onClick={(event) => { event.stopPropagation(); handleNewLesson(selectedCourse?.id); }}>Nueva Lección</button>
               
                </div>
                </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        )}

        {showModal && <div className="modal-backdrop fade show" onClick={handleClose}></div>}
                        





        </div>
        </div>
        </div>
        </div>
        </div>
                )}
                

        </div>
    );
}

export default Courses;
