import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { faChalkboard, faChevronLeft, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";

function EditCourseForm() {
    const { id } = useParams();
    console.log("curse id:  "+id);
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr]= useState('');
    
    const fileInputRef = useRef(null);

    const [course, setCourse] = useState({
        title: '',
        description: '',
        duration: '',
        level: '',
        newObjectives: '',
        objectives: [],
        creador:'',
        newContent: '',
        content: [],
        topic: [],
        imagePreview: '',
        coverImage: '',
    });

    
const availableTopic = [
    'Poo',
    'SpringBoot',
    'NetBeans',
    'Java',
    'MVC',
    'BasesdeDatos',
    'Arrays',
    'TiposDeDatos',
    'Clases',
    'Funciones',
    'Framework',
    'Sintaxis'
];

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/course/${id}/lessons`, { withCredentials: true });
                setCourse({...response.data.course,
                 imagePreview: response.data.course.coverImage ? `data:image/jpeg;base64,${response.data.course.coverImage}` : ''});
                setLessons(response.data.lessons); 
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del curso:", error);
                setLoading(false); 
            }
        };
        fetchCourseDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };


    const handleCheckboxChange = (e) => {
        const { name } = e.target;
        const newTopics = course.topic.includes(name)
            ? course.topic.filter((topic) => topic !== name)
            : [...course.topic, name];
        setCourse({ ...course, topic: newTopics });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse({ ...course, coverImage: file, imagePreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setCourse({ ...course, coverImage: null, imagePreview: '' });
        fileInputRef.current.value = '';
    };

    const handleAddObjective = () => {
        if (course.newObjectives.trim()) {
            setCourse({
                ...course,
                objectives: [...course.objectives, course.newObjectives],
                newObjectives: '',
            });
        }
    };

    const handleRemoveObjective = (index) => {
        const updatedObjectives = course.objectives.filter((_, i) => i !== index);
        setCourse({ ...course, objectives: updatedObjectives });
    };

    const handleAddContent = () => {
        if (course.newContent.trim()) {
            setCourse({
                ...course,
                content: [...course.content, course.newContent],
                newContent: '',
            });
        }
    };

    const handleRemoveContent = (index) => {
        const updatedContent = course.content.filter((_, i) => i !== index);
        setCourse({ ...course, content: updatedContent });
    };

  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', course.title);
            formData.append('description', course.description);
            formData.append('duration', course.duration);
            formData.append('level', course.level);
            formData.append('progress', course.progress);
            formData.append('creador', course.creador);
            formData.append('objectives', JSON.stringify(course.objectives));
            formData.append('content', JSON.stringify(course.content));
            formData.append('topic', JSON.stringify(course.topic));
    
            if (course.coverImage instanceof File) {
                formData.append('coverImage', course.coverImage);
            } else if (course.coverImage) {
                formData.append('coverImage', `data:image/jpeg;base64,${course.coverImage}`);
            } else {
                formData.append('coverImage', '');
            }
    
            await axios.put(`http://localhost:8080/course/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
    
            navigate('/panel/courses');
        } catch (error) {
            console.error("Error al editar el curso:", error);
            setErr("No se pudo Completar la Actualizacion!.");
        }
    };
    
    return (
        <div>

                {err && (
                    <div className="alert alert-danger alert-dismissible fade show w-50 p-1 mx-auto mt-4"  role="alert">
                        <p className="text-danger text-center">{err}</p>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
              <a href='/panel/courses' className='text-blue-dark tex-decoration-none'><FontAwesomeIcon icon={faChevronLeft} size='lg'/></a>
        <div className=''>
            <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
                <h2 className='mb-4'><FontAwesomeIcon icon={faChalkboard}/>  Editar Curso</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label>Imagen del Curso</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="coverImage"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                                {course.imagePreview && (
                                    <div className="position-relative mt-2">
                                        <img
                                            src={course.imagePreview}
                                            alt="Imagen del curso"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }}
                                        />
                                        <button
                                            type="button"
                                            className="ms-2 btn btn-secondary"
                                            onClick={handleRemoveImage}
                                            style={{ borderRadius: '50%' }}
                                        >X
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Titulo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={course.title}
                                    onChange={handleChange}
                                    required
                                    
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label>Descripción</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Duración (horas)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="duration"
                                    value={course.duration}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nivel</label>
                                <select
                                    className="form-control"
                                    name="level"
                                    value={course.level}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Elige un Nivel...</option>
                                    <option value="Basico">Basico</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                    <label>Autor(a)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="creador"
                        value={course.creador}
                        onChange={handleChange}
                        required
                    />
                </div>

                    <div className="form-group mb-3">
                        <label>Objetivos del Curso</label>
                        <div className='input-group mb-3'>
                            <input
                                type="text"
                                className="form-control"
                                name="newObjectives"
                                value={course.newObjectives}
                                onChange={handleChange}
                            />
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={handleAddObjective}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                        </div>
                        <ol>
                            {course.objectives.map((objective, index) => (
                                <li
                                    className="d-flex justify-content-between align-items-center mb-2"
                                    key={index}
                                >
                                    <div><span className='text-muted fs-5'>{index+1}.</span> {objective}</div>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => handleRemoveObjective(index)}
                                    />
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="form-group mb-3">
                        <label>Contenido</label>
                        <div className='input-group mb-3'>
                            <input
                                type="text"
                                className="form-control"
                                name="newContent"
                                value={course.newContent}
                                onChange={handleChange}
                            />
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={handleAddContent}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                        </div>
                        <ol>
                            {course.content.map((content, index) => (
                                <li
                                    className="d-flex justify-content-between align-items-center mb-2"
                                    key={index}
                                >
                                    <div><span className='text-muted fs-5'>{index+1}.</span> {content}</div>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => handleRemoveContent(index)}
                                    />
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="form-group mb-3">
                        <label>Tópicos</label>
                        <div className="d-flex flex-wrap">
                            {availableTopic.map((topic, index) => (
                                <div key={index} className="form-check me-4">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={topic}
                                        name={topic}
                                        checked={course.topic.includes(topic)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className="form-check-label" htmlFor={topic}>
                                        {topic}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                    <FontAwesomeIcon icon={faSave} />  Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default EditCourseForm;
