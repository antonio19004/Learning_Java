import React, { useState, useRef} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboard, faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import {useNavigate } from 'react-router-dom';


function CreateCourse() {
    
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

const navigate = useNavigate();



    const [course, setCourse] = useState({
        title: '',
        description: '',
        duration: '',
        level: '',
        objectives: [],
        content: [],
        progress: 0.0,
        creador:'',
        topic: [],
        newObjectives: '',
        newContent: '',
        coverImage: null,
        imagePreview:''
    });
    

    const fileInputRef = useRef(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourse((prevCourse) => ({
                ...prevCourse,
                coverImage: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse((prevCourse) => ({
                    ...prevCourse,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setCourse({
            ...course,
            coverImage: null,
            imagePreview: '',
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({
            ...course,
            [name]: value
        });
    };


    const handleAddObjective = () => {
        if (course.newObjectives.trim() === '') {
            alert("Verifica que el campo no este vacio");
            return;
        }
        console.log('Adding Objective:', course.newObjectives);
        setCourse({
            ...course,
            objectives: [...course.objectives, course.newObjectives],
            newObjectives: ''
        });
    };

    const handleAddContent = () => {
        if (course.newContent.trim() === '') {
            alert("Verifica que el campo no este vacio");
            return;
        }
        setCourse({
            ...course,
            content: [...course.content, course.newContent],
            newContent: ''
        });
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', course.title);
        formData.append('description', course.description);
        formData.append('duration', course.duration);
        formData.append('level', course.level);
        formData.append('progress', course.progress);
        formData.append('coverImage', course.coverImage);
        formData.append('objectives', JSON.stringify(course.objectives));
        formData.append('content', JSON.stringify(course.content));
        formData.append('topic', JSON.stringify(course.topic));

        try {
            const response = await axios.post('http://localhost:8080/course/create', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data' // Especificar que estás enviando un formulario con datos de archivos
                }
            });
            console.log(response.data);
            alert('Curso creada con exito');
            navigate('/panel/courses');
        } catch (error) {
            console.error(error);
        }
    };
    


    const handleRemoveObjective = (indexToRemove) => {
        setCourse((prevCourse) => ({
            ...prevCourse,
            objectives: prevCourse.objectives.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleRemoveContent = (indexToRemove) => {
        setCourse((prevCourse) => ({
            ...prevCourse,
            content: prevCourse.content.filter((_, index) => index !== indexToRemove),
        }));
    };


    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        
        if (checked) {
            setCourse((prevCourse) => {
                const updatedTopics = [...prevCourse.topic, name];
                console.log("Topics after adding:", updatedTopics);
                return {
                    ...prevCourse,
                    topic: updatedTopics,
                };
            });
        } else {
            setCourse((prevCourse) => {
                const updatedTopics = prevCourse.topic.filter((topic) => topic !== name);
                return {
                    ...prevCourse,
                    topic: updatedTopics,
                };
            });
        }
    };
    


    return (
    <div>
        <a href='/panel/courses' className='text-blue-dark tex-decoration-none'><FontAwesomeIcon icon={faChevronLeft} size='lg'/></a>

    <div className='d-flex flex-column align-items-center justify-content-center '> 
    <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
    <h2 className='mb-4'><FontAwesomeIcon icon={faChalkboard}/>  Nuevo Curso</h2>
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
                        required={!course.imagePreview}
                        ref={fileInputRef}
                    />
                    {course.imagePreview && (
                        <div className="position-relative mt-2">
                            <img
                                src={course.imagePreview}
                                alt="Imagen de perfil"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px' }}
                            />
                            <button
                                type="button"
                                className="ms-2 btn btn-secondary"
                                onClick={handleRemoveImage}
                                style={{ borderRadius: '50%'}}
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
            <ol >
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

        <div className="mb-3">
            <label className='form-label'>Seleccionar Temas</label>
            <div>
                {availableTopic.map((topic) => (
                    <div className="form-check form-check-inline" key={topic}>
                        <input
                            className='form-check-input'
                            type="checkbox"
                            name={topic}
                            checked={course.topic.includes(topic)}
                            onChange={handleCheckboxChange}
                        />
                        <label className='ms-1 text-secondary'>{topic}</label>
                    </div>
                ))}
            </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4 w-100">Crear Curso</button>
    </form>

    
</div>
    </div>
        </div>
    
    );
}

export default CreateCourse;