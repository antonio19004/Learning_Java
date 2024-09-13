import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronDown, faChevronUp, faCode, faNotdef, faSearch } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../Layouts/Loader';
import NavMenu from '../../Layouts/NavMenu';
import Footer from '../../Layouts/Footer';

function ExercisesList() {
  document.title='Ejercicios';
  const {id}= useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const fecthExercises = async () => {
    try {
      const response = await axios.get(`https://backend-learning-java.onrender.com/exercise/list`, { withCredentials: true });
      setExercises(response.data);
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details', error);
    }
  };
  
  useEffect(() => {
    fecthExercises();
  }, [id]);
  
  const [openCollapse, setOpenCollapse] = useState(null);

  const toggleCollapse = (index) => {
    setOpenCollapse(openCollapse === index ? null : index);
  }
  
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() === '') {
      setResults(exercises); 
    } else {
      const filteredResults = exercises.filter(exercise => 
          exercise.problem.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
      setResults(filteredResults);
    }
  };

  return(
    <div>
      <header>
        <NavMenu />
      </header>
      <div className='m-3'>
        {loading ? (
          <div className='d-flex justify-content-center'>
            <Loader />
          </div>
        ) : (
          <div>
            <div className='row'>
              <div>
                <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
                  <h2>Ejercicios de practica</h2>
                  <p>Aqui podras encontrar ejercicios basicos para que manejes tu logica de programador y para que poco a poco<br></br>te vuelvas mejor en el desarrollo.</p>
                  <div>
                    <div>
                      <div className="input-group mb-4 w-50">
                        <span className="input-group-text" id="basic-addon1">
                          <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input type="text" className="form-control" placeholder="Buscar ejercicios..." aria-label="Buscar ejercicios..." aria-describedby="basic-addon1" value={query} onChange={handleSearch} />
                      </div>
                    </div>
                    {results && results.length > 0 ? (
                      results.map((exercise, index) => (
                        <div key={exercise.id} className="cursor-pointer p-3 mt-4 shadow bg-light rounded">
                          <div className="d-flex justify-content-between">
                            <span className='fs-5 text-decoration-none text-blue-dark'>
                              <FontAwesomeIcon icon={faCode} /> {index + 1}. {exercise.problem}
                            </span>
                            <div className='d-flex justify-content-between'>
                              <button className="btn btn-link text-decoration-none" type="button" onClick={() => toggleCollapse(index)} aria-expanded={openCollapse === index} aria-controls={`collapseExample${index}`}>
                                <FontAwesomeIcon className='mt-1' icon={openCollapse === index ? faChevronUp : faChevronDown} /> Solución
                              </button>
                            </div>
                          </div>
                          <div className={`collapse ${openCollapse === index ? 'show' : ''}`} id={`collapseExample${index}`}>
                            <div className="card card-body mt-2 bg-dark text-light p-3" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                              <pre className="m-0 text-light">{exercise.answer}</pre>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="alert alert-primary d-flex flex-wrap" role="alert">
                        <FontAwesomeIcon className='mt-1' icon={faNotdef} />
                        <p className='ms-2'>No Hay Elementos</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer>
        <Footer/>
      </footer>
    </div>
  )
}

export default ExercisesList;
