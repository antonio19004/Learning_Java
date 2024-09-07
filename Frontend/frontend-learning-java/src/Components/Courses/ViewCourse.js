import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../Static/Styles/Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import NavMenu from '../../Layouts/NavMenu';
import Footer from '../../Layouts/Footer';
import Loader from '../../Layouts/Loader';
import diegoimg from '../../Static/Img/diego.jpeg' ;
import hermesimg from '../../Static/Img/hermes.jpeg'; 

function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/course/${id}/lessons`,{withCredentials:true});
                setCourse(response.data.course);
                setLessons(response.data.lessons);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course details:", error);
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);



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
                <div className='row'>
                    
                    <div className='col me-3'>
            {lessons.length > 0 && (
                <div>
                                    {/*<h3>{lessons[currentIndex].title}</h3>
                                    <p>{lessons[currentIndex].description}</p>
                                    <div className='d-flex justify-content-end'><p className='fs-sm'>Creado Por: <span className='text-primary fs-ssm'>Hermes Herrera & Diego Cediel</span></p></div>*/}

                    {lessons[currentIndex].video && (
                        <div>
                            <iframe
                                width="760"
                                height="415"
                                src={`https://www.youtube.com/embed/${extractYoutubeId(lessons[currentIndex].video)}`}
                                className='mb-3'
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={lessons[currentIndex].title}
                            ></iframe>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                                    <label class="form-check-label text-muted fs-sm" for="flexSwitchCheckDefault">Marcar Leccion como terminada</label>
                                </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="cursor-pointer d-flex justify-content-between p-2 mt-4 shadow bg-light rounded p-2">
                <button
                    className="btn btn-light"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0} // Deshabilitar si es la primera lección
                >
                   <span className='text-blue-dark fw-bold'>Anterior</span>
                </button>
                <button
                    className="btn btn-light"
                    onClick={handleNext}
                    disabled={currentIndex === lessons.length - 1} // Deshabilitar si es la última lección
                >
                    <span className='text-blue-dark fw-bold'>Siguiente</span>
                </button>
            </div>
            </div>
            <div className='col'>

                    <div className='bg-light shadow rounded p-3'>

                    {course && (
                    <div>
                        <h1>{course.title}</h1>
                        <p>{course.description}</p>
                        <span className='my-2 text-dark fs-sm badge badge-dark'>Creado por:</span>
                        <div className='row my-2'>
                            <div className='col'>
                                <img src={diegoimg} alt='diego' className='img-ssm rounded-circle'/>
                                <span className='ms-3 text-secondary fs-sm'>Diego Cediel</span>
                            </div>
                            <div className='col'>
                                <img src={hermesimg} alt='diego' className='img-ssm rounded-circle'/>
                                <span className='ms-3 text-secondary fs-sm'>Hermes Herrera</span>
                            </div>
                        </div>

                        <div className='my-3'>
                            <span>0% Completado</span>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                         </div>   

                         <div className='my-4  mx-2'>
                            <h5>Lecciones del curso</h5>
                                <ol className='pb-3'>
                                    {lessons.map((lesson, index) => (
                                        <div className="form-check p-1" key={index}>
                                            <input 
                                                className="form-check-input bg-secondary mt-2" 
                                                type="radio" 
                                                name="lessonRadioGroup" 
                                                id={`lessonRadio${index}`} 
                                                value={lesson.title}
                                                checked={index === currentIndex}
                                                onChange={() => setCurrentIndex(index)}
                                            />
                                            <label className="form-check-label fs-5" htmlFor={`lessonRadio${index}`}>
                                                {lesson.title}
                                            </label>
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
        <Footer></Footer>
        </div>
);
}

export default CourseDetails;