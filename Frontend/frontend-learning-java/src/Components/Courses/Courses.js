import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faChalkboardUser, faChartLine, faCircleInfo, faClock, faEdit, faFlagCheckered, faGraduationCap, faList, faListOl, faMagnifyingGlassChart, faNotdef, faSearch, faSitemap, faTrash, faUserTie } from '@fortawesome/free-solid-svg-icons';
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
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); 
    const [coursesPerPage, setCoursesPerPage] = useState(6);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://backend-learning-java.onrender.com/course/list',{withCredentials:true});
                const sortedCourses = response.data.sort((a, b) => new Date(b.created) - new Date(a.created));
                setCourses(sortedCourses);
                setResults(sortedCourses);
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
            const response = await axios.get(`https://backend-learning-java.onrender.com/course/${courseId}/lessons`, { withCredentials: true });
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
                await axios.delete(`https://backend-learning-java.onrender.com/course/delete/${courseId}`, { withCredentials: true });
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


      const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.trim() === '') {
            setResults(courses);
        } else {
            const filteredResults = courses.filter(doc => 
                doc.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        }
    };

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = results.slice(indexOfFirstCourse, indexOfLastCourse);

    const totalPages = Math.ceil(results.length / coursesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCoursesPerPageChange = (e) => {
        setCoursesPerPage(Number(e.target.value)); 
        setCurrentPage(1); 
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

            
            <div className="input-group my-4 w-50">
                        <span className="input-group-text" id="basic-addon1">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Buscar cursos..." 
                            aria-label="Buscar cursos..." 
                            aria-describedby="basic-addon1"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>


                    <div className='row'>
                                <div className="mb-3" style={{width:'14%'}}>
                                    <label htmlFor="coursesPerPage" className="form-label"><FontAwesomeIcon icon={faListOl} />  Paginación:</label>
                                    <select 
                                        id="coursesPerPage" 
                                        className="form-select" 
                                        value={coursesPerPage} 
                                        onChange={handleCoursesPerPageChange}
                                    >
                                        <option value={6}>6</option>
                                        <option value={9}>9</option>
                                        <option value={12}>12</option>
                                    </select>
                                </div>
                                </div>
           

                            {currentCourses && currentCourses.length > 0 ? (
                                    currentCourses.map((course) => (
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
                                        <FontAwesomeIcon className='mt-1' icon={faNotdef}/><p className='ms-2'> No hay Resultados!</p>
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
                    <p><span className='fs-6 fw-bold'><FontAwesomeIcon icon={faUserTie} size='sm'/>   Autor(a/s):</span>  {selectedCourse?.creador}</p>
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
        <div  className="mt-5"><Pagination totalPages={totalPages} paginate={paginate} currentPage={currentPage} /></div>
        </div>                         
        </div>
        
        </div>
        </div>
        
                )}
                

        </div>
    );
}

const Pagination = ({ totalPages, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Courses;