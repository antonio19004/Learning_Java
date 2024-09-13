import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useParams,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faChartLine, faChevronDown, faChevronLeft, faChevronUp, faCircleInfo, faClock, faEdit, faList, faNotdef, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../Layouts/Loader';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import Swal from 'sweetalert2';





function Lessons() {
    const navigate = useNavigate();
    const {id}= useParams();
    const [Lesson, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(parseInt());
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`https://backend-learning-java.onrender.com/course/${id}/lessons`, { withCredentials: true });
            setLessons(response.data.lessons);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching Lesson details:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);



const handleCardClick = async (id) => {
    try {
        const response = await axios.get(`https://backend-learning-java.onrender.com/lesson/select/${id}`, { withCredentials: true });
        setSelectedLesson(response.data); 
        setShowModal(true);
    } catch (error) {
        console.error('Error fetching course details', error);
    }
};


const handleDeleteLesson = async (id) => {
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
            await axios.delete(`https://backend-learning-java.onrender.com/lesson/delete/${id}`, { withCredentials: true });
            Swal.fire(
                'Eliminada!',
                'La lección ha sido eliminada.',
                'success'
            );
            setLessons(lessons.filter(lesson=> lesson.id !== id));
        } catch (error) {
            console.error('Error al eliminar la lección', error);
            Swal.fire(
                'Error!',
                'No se pudo eliminar la lección.',
                'error'
            );
        }
    }
};


const handleEditLesson = (id) => {
    navigate(`/panel/edit-lesson/${id}`);
  };


  
  const handleClose = () => {
    setShowModal(false);
    setSelectedLesson(null);
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

function extractYoutubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const handleMoveUp = (index) => {
    if (index > 0) {
        const newLessons = [...lessons];
        const [movedItem] = newLessons.splice(index, 1);
        newLessons.splice(index - 1, 0, movedItem);
        setLessons(newLessons);
        updateOrderOnServer(newLessons);
    }
};

const handleMoveDown = (index) => {
    if (index < lessons.length - 1) {
        const newLessons = [...lessons];
        const [movedItem] = newLessons.splice(index, 1);
        newLessons.splice(index + 1, 0, movedItem);
        setLessons(newLessons);
        updateOrderOnServer(newLessons);
    }
};

const updateOrderOnServer = async (newOrder) => {
    try {
        const lessonIds = newOrder.map(lesson => lesson.id);
        await axios.post(`https://backend-learning-java.onrender.com/course/${id}/update-lessons-order`, lessonIds, { withCredentials: true });
        console.log('Orden actualizado en el servidor');

        // Actualiza el estado local con el nuevo orden de lecciones
        fetchCourseDetails();

    } catch (error) {
        console.error('Error al actualizar el orden en el servidor', error);
    }
};

return(
    <div>
          <a href='/panel/courses' className='text-blue-dark tex-decoration-none'><FontAwesomeIcon icon={faChevronLeft} size='lg'/></a>

             {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader />
                    </div>
                ) : (
                     
        <div className='row'>
        <div>
        <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
            <h2> <FontAwesomeIcon icon={faList}/>  Lista de Lecciones</h2>

            
            {lessons && lessons.length > 0 ? (
            lessons.map((Lesson, index) => (
               
 <div className="cursor-pointer d-flex justify-content-between p-3 mt-4 shadow bg-light rounded"
 onClick={() => handleCardClick(Lesson.id)}   key={Lesson.id}>
                    <a className='fs-5 text-decoration-none text-blue-dark'>
                        <FontAwesomeIcon icon={faBookmark}/> {index + 1}. {Lesson.title}
                    </a>
                    <div className='d-flex justify-content-between'>
                        <div onClick={(event) => {event.stopPropagation();  handleMoveUp(index);}}>
                            <FontAwesomeIcon className='me-2' icon={faChevronUp} style={{color: 'blue'}}/>
                        </div>
                        <div onClick={(event) => {event.stopPropagation(); handleMoveDown(index); }}>
                            <FontAwesomeIcon className='me-2' icon={faChevronDown} style={{color: 'blue'}}/>
                        </div>
                        <div onClick={(event) => { event.stopPropagation(); handleDeleteLesson(Lesson.id); }}>
                            <FontAwesomeIcon className='me-2' icon={faTrash} style={{color:'red'}}/>
                        </div>
                        <div onClick={(event) => { event.stopPropagation(); handleEditLesson(Lesson.id); }}>
                            <FontAwesomeIcon icon={faEdit} style={{color:'#ebb00f'}}/>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="alert alert-primary d-flex flex-wrap" role="alert">
                <FontAwesomeIcon className='mt-1' icon={faNotdef}/><p className='ms-2'>No Hay Elementos</p>
            </div>
        )}



                    </div>
                    </div>
                    </div>
                 

                       
        {selectedLesson && (
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4><FontAwesomeIcon icon={faCircleInfo}/>  Detalles de la Lección</h4>
                        <button type="button" className='btn-close' onClick={handleClose} data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                     <div className='d-flex justify-content-between'>
                     <div>      
                    <h2 className="modal-title">{selectedLesson?.title}</h2>
                    <p>{selectedLesson?.description}</p>
                    </div>
                    <div>
                                                {selectedLesson?.video ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${extractYoutubeId(selectedLesson.video)}/hqdefault.jpg`}
                                                        alt={selectedLesson?.title}
                                                        width="100"
                                                        height="80"
                                                        className="mb-3 border rounded"
                                                    />
                                                ) : (
                                                    <p>No hay video disponible</p>
                                                )}
                                            </div>
                    </div>
                    <hr />
                    <p><span className='fs-6 fw-bold'><FontAwesomeIcon icon={faCalendarDays} size='sm'/>   Ultima Actualización:</span>  {formatDate(selectedLesson?.lastUpdate)}</p>
                    <p><span className='fs-6 fw-bold'><FontAwesomeIcon icon={faClock} size='sm'/>  Duración:</span>  {selectedLesson?.duration} Horas(s)</p>

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

                )}


                
    </div>
)

}
export default Lessons;