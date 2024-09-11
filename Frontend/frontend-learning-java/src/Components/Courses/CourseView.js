import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle ,faClock} from '@fortawesome/free-regular-svg-icons';
import { faCalendarDays, faChartLine, faChevronLeft, faNotdef } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import NavMenu from '../../Layouts/NavMenu';
import Comment from '../Comment';
import Footer from '../../Layouts/Footer';
import Loader from '../../Layouts/Loader';
import UserImg from '../../Static/Img/User.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../../Static/Styles/Style.css';

function CourseView() {
    document.title='Curso';

    const isAuthenticated = localStorage.getItem('username') !== null;
    const navigate = useNavigate();
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress]= useState(0);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const rol = localStorage.getItem('role');
    const baseUrl = rol === 'ROLE_USER' ? 'users' : 'admin';

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/course/${id}/lessons`, { withCredentials: true });
                setCourse(response.data.course);
                setLessons(response.data.lessons);
                setLoading(false);

                const progressResponse = await axios.get(`http://localhost:8080/${baseUrl}/curso/${id}/progreso`,{withCredentials:true});
                setProgress(progressResponse.data);

                
                const completedLessonsResponse = await axios.get(`http://localhost:8080/${baseUrl}/curso/${id}/lecciones-completadas`, { withCredentials: true });
                setCompletedLessons(new Set(completedLessonsResponse.data));


            } catch (error) {
                console.error("Error al obtener los detalles del curso: ", error);
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [id]);

    useEffect(() => {
        if (lessons.length > 0) {
            const totalLessons = lessons.length;
            const completedCount = completedLessons.size;
            const calculatedProgress = (completedCount / totalLessons) * 100;
            setProgress(calculatedProgress);
        }
    }, [lessons, completedLessons]);

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

    const handleLessonClick = (lessonIndex) => {
        navigate(`/course/${course.id}/lesson/${lessonIndex}`);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <NavMenu />
            <div> 
                {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader />
                    </div>
                ) : (
                    <div className='p-5'>
                        <a onClick={goBack} className='text-blue-dark tex-decoration-none cursor-pointer mb-5'><FontAwesomeIcon icon={faChevronLeft} size='lg'/></a>
                        <div className='row'>
                            <div className='col me-3'>
                                {course && (
                                    <div>
                                        <h1>{course.title}</h1>
                                        <p>{course.description}</p>
                                        <div className='d-flex justify-content-end'>
                                            <p className='fs-sm'>Creado Por: <span className='text-primary fs-ssm'>Hermes Herrera & Diego Cediel</span></p>
                                        </div>
                                        <img src={`data:image/jpeg;base64,${course.coverImage}`} alt={course.title} width="760" height="470" className='mb-3 border rounded' />
                                    </div>
                                )}
                                <h3>Objetivos del curso</h3>
                                <div className='bg-light shadow rounded p-3 mb-4'>
                                    <ul className='list-unstyled'>
                                        <li className='fs-5'>
                                            <span><FontAwesomeIcon icon={faCheckCircle} /></span>  {course.objectives}
                                        </li>
                                    </ul>
                                </div>
                                <h3>Lecciones del curso</h3>
                                {course.lesson && course.lesson.length > 0 ? (
                                    lessons.map((lesson, index) => (
                                        <div className="cursor-pointer d-flex justify-content-between p-3 mt-4 shadow bg-light rounded" onClick={() => handleLessonClick(index)} key={index}>
                                            <a className='fs-5 text-decoration-none text-blue-dark'>{index+1}. {lesson.title}</a>
                                            <p className='text-muted fs-6'>{lesson.duration}min(s)</p>
                                        </div>
                                    ))):(
                                        <div class="alert alert-primary d-flex flex-wrap" role="alert">
                                            <FontAwesomeIcon className='mt-1' icon={faNotdef}/><p className='ms-2'>No Hay Elementos</p>
                                        </div>
                                    )
                                }
                                <div className='my-4 mx-2'>
                                    <h4 className=''>¿Que Aprenderas?</h4>
                                    <ul className='d-flex flex-wrap mt-4'>
                                        {course.content && course.content.length > 0 ? (
                                            course.content.map((content, index) => (
                                                <li key={index} className='fs-5 '>
                                                    {content}
                                                </li>
                                            ))
                                        ) : (
                                            <li className='fs-5'>No hay temas relacionados disponibles.</li>
                                        )}
                                    </ul>
                                </div>
                                <Comment id={id} />
                            </div>
                            <div className='col'>
                                <div className='bg-light shadow rounded p-3'>
                                    {course && (
                                        <div>
                                            <h3>Detalles del curso</h3>
                                            <div className="p-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className="me-2"><FontAwesomeIcon icon={faCalendarDays} /></span>
                                                    <div>
                                                        <p className='fs-5 mb-0'>Última Actualización:</p>
                                                        <p className='text-muted mb-0'>{course.lastUpdate ? formatDate(course.lastUpdate) : 'Fecha NO disponible'}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className="me-2"><FontAwesomeIcon icon={faClock} /></span>
                                                    <div>
                                                        <p className='fs-5 mb-0'>Duración:</p>
                                                        <p className='text-muted mb-0'>{course.duration} Hora(s)</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2"><FontAwesomeIcon icon={faChartLine} /></span>
                                                    <div>
                                                        <p className='fs-5 mb-0'>Nivel:</p>
                                                        <p className='text-muted mb-0'>{course.level}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {isAuthenticated && (
                                                <div className="my-3">
                                                    <span>{Math.round(progress)}% Completado</span>
                                                    <div className="progress">
                                                        <div className="progress-bar" role="progressbar" style={{ width: `${Math.round(progress)}%` }} aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className='my-4 mx-2'>
                                                <h4>Temas Relacionados</h4>
                                                <ul className='list-unstyled d-flex flex-wrap'>
                                                    {course.topic && course.topic.length > 0 ? (
                                                        course.topic.map((topic, index) => (
                                                            <li key={index} className='fs-5 me-3'>
                                                                <div className='badge bg-info'>{topic}</div>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className='fs-5'>No hay temas relacionados disponibles.</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default CourseView;
