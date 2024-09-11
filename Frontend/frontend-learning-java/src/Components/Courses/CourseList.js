import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../../Layouts/NavMenu';
import Footer from '../../Layouts/Footer';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import Loader from '../../Layouts/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faSearch } from '@fortawesome/free-solid-svg-icons';

function CourseList() {
  document.title='Cursos';
    const [courses, setCourses] = useState([]);
    const navigate= useNavigate();
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/course/list',{withCredentials:true});
                setCourses(response.data);
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);



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


    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);
    
        if (searchTerm.trim() === '') {
            setResults(courses); 
        } else {
            const filteredResults = courses.filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) 
            );
            setResults(filteredResults);
        }
    };

    return (
        <div>
            <NavMenu/>
        <div className="p-4">
        <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
        <div>
        <h1 className='fs-1 fw-light my-5 text-center'>Cursos Disponibles</h1>
            <div className="mx-5">
            {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader/>
                    </div>
                ) : (
                    
           <div>  
              <div className="input-group mb-4 w-50">
                        <span className="input-group-text" id="basic-addon1">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Buscar Cursos..." 
                            aria-label="Buscar Cursos..." 
                            aria-describedby="basic-addon1"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>   


        {results.length > 0 ? (     
          <div className="row row-cols-1 row-cols-md-3 g-4 my-3">
          {results.map((curso) => {
            const fecha = parseISO(curso.created);
            const formattedDate = formatRelativeDate(fecha);

            const handleViewCourse = (id) => {
              navigate(`/courseview/${id}`);
            };

  return (
    <div className="col" key={curso.id}>
      <div className="card h-100 mx-2">
        <img
          src={`data:image/jpeg;base64,${curso.coverImage}`}
          className="card-img-top w-100"
          alt={curso.title}
        />
        <div className="card-body">
          <h5 className="card-title">{curso.title}</h5>
          <p className="card-text">{curso.description}</p>
          <button onClick={()=>handleViewCourse(curso.id)} className="btn btn-primary">Ver curso</button>
        </div>
        <div className="card-footer">
          <small className="text-muted">Subido: {formattedDate}</small>
        </div>
      </div>
    </div>
  );
})}
      </div>
       ) : (
        <div>
                        <div class="alert alert-info" role="alert">
                          <FontAwesomeIcon icon={faCircleExclamation}/>  No hay Resultados!
                        </div>
        </div>
        )}
      </div>
      )}
      </div>

      </div>
      </div>
        </div>
        <Footer/>
        </div>
    );
}

export default CourseList;
