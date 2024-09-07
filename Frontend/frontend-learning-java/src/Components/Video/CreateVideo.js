import React, { useState,useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



function Createvideo() {


    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        axios.get('http://localhost:8080/course/list',{withCredentials:true}) // Ruta para obtener la lista de cursos
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    const [video, setvideo] = useState({
        title: '',
        url: '',
        duration: '',
        index: '',
        Idcurso:''
    });

    const handleCourseSelect = (e) => {
        const selectedCourseId = e.target.value;
        setvideo({
            ...video,
            Idcurso: selectedCourseId 
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setvideo({
            ...video,
            [name]: value
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/video/create',video,{withCredentials:true});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    return (
    <div>
        <div className="container w-50">
            <h2>Create New video</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titulo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={video.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Url</label>
                    <textarea
                        className="form-control"
                        name="url"
                        value={video.url}
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
                        value={video.duration}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>
            
                <div className="form-group">
                <label>Indice</label>
                <div className='input-group mb-3'>
                    <input
                        type="number"
                        min={1}
                        className="form-control"
                        name="index"
                        value={video.index}
                        onChange={handleChange}
                        
                    />
                </div>
                </div>
                

                <div className="form-group">
                        <label htmlFor="courseSelect">Selecciona un Curso</label>
                        <select
                            name="Idcurso"
                            className="form-control"
                            value={video.Idcurso}
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

                <button type="submit" className="btn btn-success mt-4">Guardar Video</button>
            </form>


            
            
        </div>
        </div>
    );
}

export default Createvideo;
