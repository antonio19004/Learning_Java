import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronUp,  faCode, faEdit, faLaptopCode, faList, faNotdef, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../Layouts/Loader';
import Swal from 'sweetalert2';

function Exercises() {

  const navigate = useNavigate();
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

  const handleDeleteExercise = async (id) => {
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
        await axios.delete(`https://backend-learning-java.onrender.com/exercise/delete/${id}`, { withCredentials: true });
        Swal.fire(
          'Eliminado!',
          'El ejercicio ha sido eliminado.',
          'success'
        );
        setExercises(exercises.filter(exercises=> exercises.id !== id));
      } catch (error) {
        console.error('Error al eliminar ejercicio', error);
        Swal.fire(
          'Error!',
          'No se pudo eliminar el ejercicio.',
          'error'
        );
      }
    }
  };

  const handleEditExercise = (id) => {
    navigate(`/panel/edit-exercise/${id}`);
  };

  const handleFormExercise = () => {
    navigate(`/panel/exerciseForm`);
  };

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
        const filteredResults = exercises.filter(doc => 
            doc.problem.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredResults);
    }
};

  return(
    <div>
      {loading ? (
        <div className='d-flex justify-content-center'>
          <Loader />
        </div>
      ) : (
        <div>
          <div className='row'>
            <div>
              <div className='shadow bg-light px-5 pb-5 pt-5 my-4 rounded'>
                <h2><FontAwesomeIcon icon={faLaptopCode}/>  Ejercicios</h2>
                <p>Creacion de Ejercicios de practica.</p>
                <buttom className='btn btn-success' onClick={handleFormExercise}>
                  Nuevo Ejercicio
                </buttom>
              </div>
            </div>
          </div>
          <div className='row'>
            <div>
              <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
                <div>
                  <h2> <FontAwesomeIcon icon={faList}/>  Lista de Ejercicios</h2>

                  <div className="input-group my-4 w-50">
                        <span className="input-group-text" id="basic-addon1">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Buscar ejercicios..." 
                            aria-label="Buscar ejercicios..." 
                            aria-describedby="basic-addon1"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>


                  {results && results.length > 0 ? (
                    results.map((exercise, index) => (
                      <div key={exercise.id} className="cursor-pointer p-3 mt-4 shadow bg-light rounded">
                        <div className="d-flex justify-content-between">
                          <span className='fs-5 text-decoration-none text-blue-dark'>
                            <FontAwesomeIcon icon={faCode}/> {index + 1}. {exercise.problem}
                            <div ><p className='badge bg-info rounded'>{exercise.topic}</p></div>
                          </span>
                          <div className='d-flex justify-content-between'>
                            <button className="btn btn-link text-decoration-none" type="button" onClick={() => toggleCollapse(index)} aria-expanded={openCollapse === index} aria-controls={`collapseExample${index}`}>
                              <FontAwesomeIcon className='mt-1' icon={openCollapse === index ? faChevronUp : faChevronDown} /> Ver Solución
                            </button>
                            <div onClick={(event) => { event.stopPropagation(); handleDeleteExercise(exercise.id); }}><FontAwesomeIcon className='me-2' icon={faTrash} style={{color:'red',}}/></div>
                            <div onClick={(event) => { event.stopPropagation(); handleEditExercise(exercise.id); }}><FontAwesomeIcon icon={faEdit} style={{color:'#ebb00f',}}/></div>
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
  )
}

export default Exercises;
