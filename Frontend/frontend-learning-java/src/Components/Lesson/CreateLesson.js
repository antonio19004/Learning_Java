import React, { useState,useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



function CreateLesson() {


    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        axios.get('http://localhost:8080/course/list',{withCredentials:true}) 
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

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

    const handleCourseSelect = (e) => {
        const selectedCourseId = e.target.value;
        setLesson({
            ...lesson,
            idCourse: selectedCourseId 
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson({
            ...lesson,
            [name]: value
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/lesson/create',lesson,{withCredentials:true});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    return (
    <div>
        <div className="container w-50">
            <h2>Crear Nueva Lección</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titulo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={lesson.title}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <div className="form-group">
                    <label>Url lesson</label>
                    <input
                        type="text"
                        className="form-control"
                        name="video"
                        value={lesson.video}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Duración(min)</label>
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
            
                <div className="form-group">
                <label>Orden</label>
                <div className='input-group mb-3'>
                    <input
                        type="number"
                        min={1}
                        className="form-control"
                        name="order"
                        value={lesson.order}
                        onChange={handleChange}
                        
                    />
                </div>

                <div className="form-group">
                    <label>Progreso</label>
                    <input
                        type="text"
                        className="form-control"
                        name="progress"
                        value={lesson.progress}
                        onChange={handleChange}
                        disabled
                        required
                    />
                </div>



                </div>
                <div className="form-group">
                        <label htmlFor="courseSelect">Selecciona un Curso</label>
                        <select
                            name="idCourse"
                            className="form-control"
                            value={lesson.idCourse}
                            onChange={handleCourseSelect}
                            
                        >
                            <option value="" disabled>Elige un curso...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                <div>
          
            </div>

                <button type="submit" className="btn btn-success mt-4">Guardar lesson</button>
            </form>


            
            
        </div>
        </div>
    );
}

export default CreateLesson;
