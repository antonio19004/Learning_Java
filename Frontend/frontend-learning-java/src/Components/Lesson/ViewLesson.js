import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import '../../Static/Styles/Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser, faChevronLeft, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import NavMenu from '../../Layouts/NavMenu';
import Comment from '../Comment';
import Footer from '../../Layouts/Footer';
import Loader from '../../Layouts/Loader';
import Developer1 from '../../Static/Img/Developer1.jpeg';
import Developer2 from '../../Static/Img/Developer2.jpeg';

function ViewLesson() {

    const navigate = useNavigate();
    const { id,lessonIndex } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(parseInt(lessonIndex, 10));
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const rol = localStorage.getItem('role');
    const baseUrl = rol === 'ROLE_USER' ? 'users' : 'admin';
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (username === null) {
            navigate('/login');
        }
    }, [username]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/course/${id}/lessons`,{withCredentials:true});
                setCourse(response.data.course);
                setLessons(response.data.lessons);
                setLoading(false);

                const progressResponse = await axios.get(`http://localhost:8080/${baseUrl}/curso/${id}/progreso`,{withCredentials:true});
                setProgress(progressResponse.data);


                const completedLessonsResponse = await axios.get(`http://localhost:8080/${baseUrl}/curso/${id}/lecciones-completadas`, { withCredentials: true });
                setCompletedLessons(new Set(completedLessonsResponse.data));

            } catch (error) {
                console.error("Error fetching course details:", error);
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    const handleCheckboxChange = async (lessonId) => {
        try {
            await axios.post(`http://localhost:8080/${baseUrl}/completados/${id}/leccion/${lessonId}`, {}, { withCredentials: true });
            
            const updatedProgressResponse = await axios.get(`http://localhost:8080/${baseUrl}/curso/${id}/progreso`,{withCredentials:true});
            setProgress(updatedProgressResponse.data);
            setCompletedLessons((prevCompleted) => {
                const updatedCompleted = new Set(prevCompleted);
                if (updatedCompleted.has(lessonId)) {
                    updatedCompleted.delete(lessonId);
                } else {
                    updatedCompleted.add(lessonId);
                }
                return updatedCompleted;
            });
        } catch (error) {
            console.error("Error updating lesson completion:", error);
        }
    };

    useEffect(() => {
        if (lessons.length > 0) {
            const totalLessons = lessons.length;
            const completedCount = completedLessons.size;
            const calculatedProgress = (completedCount / totalLessons) * 100;
            setProgress(calculatedProgress);
        }
    }, [lessons, completedLessons]);

    function extractYoutubeId(url) {
        const regExp = /^.*(youtu\.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Navegar hacia atrás, sin pasar el primer índice
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, lessons.length - 1)); // Navegar hacia adelante, sin pasar el último índice
    };

    const handleCourseClick = () => {
        navigate(`/courseview/${course.id}`);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <NavMenu/>
            <div> 
                {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader />
                    </div>
                ) : (
                    <div className='p-5'>
                        <a  onClick={goBack} className='text-blue-dark tex-decoration-none cursor-pointer'><FontAwesomeIcon icon={faChevronLeft} size='lg'/></a>
                        <div className='row'>
                            <div className='col me-3'>
                                {lessons.length > 0 && (
                                    <div>
                                        {/*<h3>{lessons[currentIndex].title}</h3>
                                        <p>{lessons[currentIndex].description}</p>
                                        <div className='d-flex justify-content-end'><p className='fs-sm'>Creado Por: <span className='text-primary fs-ssm'>Hermes Herrera & Diego Cediel</span></p></div>*/}
                                        
                                        {lessons[currentIndex].video && (
                                            <div>
                                                <iframe width="760" height="415" src={`https://www.youtube.com/embed/${extractYoutubeId(lessons[currentIndex].video)}`} className='mb-3'
                                                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                                                title={lessons[currentIndex].title}></iframe>
                                                
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id={`lessonCheckbox${currentIndex}`} checked={completedLessons.has(lessons[currentIndex].id)} onChange={() => handleCheckboxChange(lessons[currentIndex].id)} />
                                                    <label className="form-check-label text-muted fs-sm" htmlFor={`lessonCheckbox${currentIndex}`}>Marcar Lección como terminada</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="cursor-pointer d-flex justify-content-between p-2 mt-4 shadow bg-light rounded p-2">
                                    <button className="btn btn-light" onClick={handlePrevious} disabled={currentIndex === 0}>
                                        <span className='text-blue-dark fw-bold'>Anterior</span>
                                    </button>
                                    <button className="btn btn-light" onClick={handleNext} disabled={currentIndex === lessons.length - 1}>
                                        <span className='text-blue-dark fw-bold'>Siguiente</span>
                                    </button>
                                </div>
                                <Comment id={course.id} />
                            </div>
                            <div className='col'>
                                <div className='bg-light shadow rounded p-3'>
                                    {lessons && (
                                        <div>
                                            <div className='d-flex flex-row text-blue-dark cursor-pointer' onClick={handleCourseClick}><FontAwesomeIcon className='mt-3 me-2' size='xl' icon={faChalkboardUser}/><h1>{course.title}</h1></div>
                                            <div className='ms-2'>
                                                <h4>{lessons[currentIndex].title}</h4>
                                                <p>{lessons[currentIndex].description}</p>
                                            </div>
                                            <span className='my-2 text-dark fs-sm badge badge-dark'>Creado por:</span>
                                            <div className='row my-2'>
                                                <div className='col'>
                                                    <img src={Developer1} alt='Diego' className='img-ssm rounded-circle'/>
                                                    <span className='ms-3 text-secondary fs-sm'>Diego Cediel</span>
                                                </div>
                                                <div className='col'>
                                                    <img src={Developer2} alt='Hermes' className='img-ssm rounded-circle'/>
                                                    <span className='ms-3 text-secondary fs-sm'>Hermes Herrera</span>
                                                </div>
                                            </div>
                                            <div className="my-3">
                                                <span>{Math.round(progress)}% Completado</span>
                                                <div className="progress">
                                                    <div className="progress-bar" role="progressbar" style={{ width: `${Math.round(progress)}%` }} aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                            <div className='my-4  mx-2'>
                                                <h5>Lecciones del curso</h5>
                                                <ol className='pb-3'>
                                                    {lessons.map((lesson, index) => (
                                                        <div className="form-check p-1" key={index}>
                                                            <input className="form-check-input bg-secondary mt-2" type="radio" name="lessonRadioGroup" id={`lessonRadio${index}`} value={lesson.title} checked={index === currentIndex} onChange={() => setCurrentIndex(index)} />
                                                            <label className="form-check-label fs-5" htmlFor={`lessonRadio${index}`}>{lesson.title}</label>
                                                        </div>
                                                    ))}
                                                </ol>
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

export default ViewLesson;
