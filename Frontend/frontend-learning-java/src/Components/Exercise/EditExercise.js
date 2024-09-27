import React, { useState,useEffect} from 'react';
import {useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser, faChevronLeft} from '@fortawesome/free-solid-svg-icons';


function EditExercise() {

    const {id} = useParams();
    const navigate =useNavigate();
    
    const topicOptions = [
      "Poo",
      "SpringBoot",
      "NetBeans",
      "Java",
      "MVC",
      "BasesdeDatos",
      "Arrays",
      "TiposDeDatos",
      "Clases",
      "Funciones",
      "Framework",
      "NoSQL",
      "SQL",
      "EstructurasDeDatos",
      "Sintaxis"
      ];
      
   

    const [Exercises, setExercises] = useState({
        title: '',
        problem: '',
        answer: '',
        topic: ''
    });


    useEffect(() => {
        const fetchLessonDetails = async () => {
            try {
                const response = await axios.get(`https://backend-learning-java.onrender.com/exercise/select/${id}`, { withCredentials: true });
                setExercises(response.data);
            } catch (error) {
                console.error("Error al obtener los datos de ejercicio:", error);
            }
        };
        fetchLessonDetails();
    }, [id]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercises({
            ...Exercises,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://backend-learning-java.onrender.com/exercise/update/${id}`,Exercises,{withCredentials:true});
            console.log(response.data);
            alert('Ejercicio Actualizado con exito');
            navigate('/panel/exercises');
            
        } catch (error) {
            console.error(error);
        }
    };

  
  
    return (
        <div>
        <a href='/panel/exercises' className='text-blue-dark text-decoration-none'>
          <FontAwesomeIcon icon={faChevronLeft} size='lg' />
        </a>
        <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
          <h2 className='mb-4'><FontAwesomeIcon icon={faChalkboardUser}/>  Nuevo Ejercicio</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Problema</label>
                  <textarea
                    type="text"
                    className="form-control"
                    name="problem"
                    value={Exercises.problem}
                    onChange={handleChange}
                    required
                  />
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                  <label>Respuesta</label>
                  <textarea
                    type="text"
                    className="form-control bg-dark text-light"
                    name="answer"
                    value={Exercises.answer}
                    onChange={handleChange}
                    required
                  />
                </div>
            </div>

        <div className="form-group">
        <label>Tema</label>
        <select
          className="form-control"
          name="topic"
          value={Exercises.topic}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Seleccionar un tema</option>
          {topicOptions.map((topic, index) => (
            <option key={index} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
            </div>

            <button className='btn btn-primary'>Guardar Cambios</button>
          </form>
        </div>
      </div>
      
    
    );
}

export default EditExercise;
