import React, { useState} from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser, faChevronLeft} from '@fortawesome/free-solid-svg-icons';


function CreateExercise() {

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
        "Sintaxis"
      ];
      
   

    const [Exercises, setExercises] = useState({
        title: '',
        problem: '',
        answer: '',
        topic: ''
    });


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
            const response = await axios.post('https://backend-learning-java.onrender.com/exercise/create',Exercises,{withCredentials:true});
            console.log(response.data);
            alert('Ejercicio creado con exito');
            navigate('/panel/exercises');
            
        } catch (error) {
            console.error(error);
        }
    };

  
  
    return (
        <div>
        <a href='/panel/courses' className='text-blue-dark text-decoration-none'>
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

            <button className='btn btn-primary'>Crear</button>
          </form>
        </div>
      </div>
      
    
    );
}

export default CreateExercise;
