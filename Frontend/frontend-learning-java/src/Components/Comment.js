import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import UserImg from '../Static/Img/User.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../Static/Styles/Comment.css';

const Comment = ({id}) => {

    const isAuthenticated = localStorage.getItem('username') !== null;
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');
    const [averageSource, setAverageSource] = useState(0);
    const [highest, setHighest] = useState(null);
    const [lowest, setLowest] = useState(null);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        fetchAverageSource();
        fetchHighestScoreComment();
        fetchLowestScoreComment();
        fetchAllComments();
    }, [])

    const fetchAverageSource = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comment/view/average-score/${id}`);
            if (response.status === 200) {
                setAverageSource(response.data);
            }
        } catch (error) {
            console.error("Error al obtener la calificación promedio: ", error);
        }
    };

    const fetchHighestScoreComment = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comment/view/highest-score-comment/${id}`);
            if (response.status === 200) {
                setHighest(response.data);
            }
        } catch (error) {
            console.error("Error al obtener el comentario con mayor puntuación: ", error);
        }
    };

    const fetchLowestScoreComment = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comment/view/lowest-score-comment/${id}`);
            if (response.status === 200) {
                setLowest(response.data);
            }
        } catch (error) {
            console.error("Error al obtener el comentario con menor puntuación: ", error);
        }
    };

    const fetchAllComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comment/view/${id}`);
            if (response.status === 200) {
                setComments(response.data);
            }
        } catch (error) {
            console.error("Error al obtener los comentarios: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            course: { id: id },
            stars: stars,
            comentario: comment
        };

        try {
            const response = await axios.post('http://localhost:8080/comment/score', data, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setComment('');
            setStars(0);
            fetchAverageSource();
            fetchHighestScoreComment();
            fetchLowestScoreComment();
            fetchAllComments();
        } catch (error) {
            console.error("Error al enviar el comentario: ", error);
        }
    };

    const handleToggle = () => {
        setShowMore(!showMore);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !comment.trim()) {
            e.preventDefault();
        }
    };

    const formatDate = (date) => {
        const distance = formatDistanceToNow(date, { addSuffix: true, locale: es });
    
        if (distance.includes('hace alrededor de')) {
            return distance.replace('hace alrededor de ', 'hace ');
        }
        return distance;
    };

    const renderStars = (average) => {
        const fullStars = Math.floor(average);
        const halfStar = average % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        const starsArray = [];

        for (let i = 0; i < fullStars; i++) {
            starsArray.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: '#FFD700', fontSize: '25px' }} />);
        }

        if (halfStar) {
            starsArray.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} style={{ color: '#FFD700', fontSize: '25px' }} />);
        }

        for (let i = 0; i < emptyStars; i++) {
            starsArray.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} style={{ color: '#D3D3D3', fontSize: '25px' }} />);
        }

        return starsArray;
    }

    return (
        <div className='my-4 mx-2'>
            <div className='stars-container'>
                <span className='average-source ms-2' style={{ marginLeft: '15px', marginRight: '20px' }}>{averageSource.toFixed(1)}</span> {renderStars(averageSource)}
            </div>
            <div className='comments-section'>
                {highest && (
                    <div className='comment-item d-flex mb-3'>
                        {highest.user?.imagenPerfil ? (
                            <img src={`data:image/jpeg;base64,${highest.user.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        ) : highest.admin?.imagenPerfil ? (
                            <img src={`data:image/jpeg;base64,${highest.admin.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        ) : (
                            <img src={UserImg} className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        )}
                        <div>
                            <div className='d-flex align-items-center mb-1'>
                                <strong>{highest.user?.user ? highest.user.user : highest.admin?.user ? highest.admin.user : 'Usuario desconocido'} - </strong> <span className='text-muted ms-2'>{formatDate(highest.fechaPublicacion)}</span>
                            </div>
                            <div className='d-flex align-items-center'>
                                {renderStars(highest.stars)}
                            </div>
                            <p className='mt-2'>{highest.comentario}</p>
                        </div>
                    </div>
                )}
                {lowest && comments.length > 1 && (
                    <div className='comment-item d-flex mb-3'>
                        {lowest.user?.imagenPerfil ? (
                            <img src={`data:image/jpeg;base64,${lowest.user.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        ) : lowest.admin?.imagenPerfil ? (
                            <img src={`data:image/jpeg;base64,${lowest.admin.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        ) : (
                            <img src={UserImg} className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        )}
                        <div>
                            <div className='d-flex align-items-center mb-1'>
                                <strong>{lowest.user?.user ? lowest.user.user : lowest.admin?.user ? lowest.admin.user : 'Usuario desconocido'} - </strong> <span className='text-muted ms-2'>{formatDate(lowest.fechaPublicacion)}</span>
                            </div>
                            <div className='d-flex align-items-center'>
                                {renderStars(lowest.stars)}
                            </div>
                            <p className='mt-2'>{lowest.comentario}</p>
                        </div>
                    </div>
                )}
                {showMore && comments.length > 1 && (
                    <ul className='comment-list'>
                        {comments.filter(comment => highest && lowest && comment.id !== highest.id && comment.id !== lowest.id)
                            .slice(0, 2).map((comment, index) => (
                            <li key={index} className='comment-item d-flex mb-3'>
                                {comment.user?.imagenPerfil ? (
                                    <img src={`data:image/jpeg;base64,${comment.user.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                ) : comment.admin?.imagenPerfil ? (
                                    <img src={`data:image/jpeg;base64,${comment.admin.imagenPerfil}`} alt="Imagen de perfil de usuario" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                ) : (
                                    <img src={UserImg} className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                )}
                                <div>
                                    <div className='d-flex align-items-center mb-1'>
                                        <strong>{comment.user?.user ? comment.user.user : comment.admin?.user ? comment.admin.user : 'Usuario desconocido'} - </strong> <span className='text-muted ms-2'>{formatDate(comment.fechaPublicacion)}</span>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        {renderStars(comment.stars)}
                                    </div>
                                    <p className='mt-2'>{comment.comentario}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {comments.length > 2 && (
                    <button className='btn btn-link text-decoration-none mt-2' onClick={handleToggle} style={{ fontSize: '16px' }}>
                        {showMore ? 'Ocultar comentarios' : 'Ver más comentarios'}
                        <FontAwesomeIcon icon={showMore ? faChevronUp : faChevronDown} className='ms-2' />
                    </button>
                )}
                {isAuthenticated && (
                    <div className='rating-form'>
                        <textarea className='form-control mb-2' value={comment} onChange={(e) => setComment(e.target.value)} onKeyPress={handleKeyPress} placeholder='Escribe tu comentario aquí...' />
                        <div className='stars-selection'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} onClick={() => setStars(star)} className={`star ${star <= stars ? 'filled' : ''}`}>
                                    <FontAwesomeIcon icon={faStar} />
                                </span>
                            ))}
                        </div>
                        <button className='btn btn-dark mt-2' onClick={handleSubmit} disabled={!comment.trim()}>Enviar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
