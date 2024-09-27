import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../../Layouts/NavMenu';
import Footer from '../../Layouts/Footer';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; 
import Loader from '../../Layouts/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpWideShort, faChartLine, faCircleExclamation, faListOl, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

function CourseList() {
    document.title = 'Cursos';
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [coursesPerPage, setCoursesPerPage] = useState(6);
    const [sortOrder, setSortOrder] = useState('desc');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://backend-learning-java.onrender.com/course/list', { withCredentials: true });
                
                const sortedCourses = response.data.sort((a, b) => new Date(b.created) - new Date(a.created));
                setCourses(sortedCourses);
                setResults(sortedCourses);
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
        setCurrentPage(1); 
    };


    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = results.slice(indexOfFirstCourse, indexOfLastCourse);

    const totalPages = Math.ceil(results.length / coursesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleCoursesPerPageChange = (e) => {
        setCoursesPerPage(Number(e.target.value)); 
        setCurrentPage(1); 
    };

    const handleLevelFilterChange = (e) => {
      const selectedLevel = e.target.value;
      if (selectedLevel === "") {
          setResults(courses); 
      } else {
          const filteredCourses = courses.filter(course => course.level === selectedLevel);
          setResults(filteredCourses);
      }
      setCurrentPage(1); 
  };


  const handleDurationFilterChange = (e) => {
    const selectedDuration = e.target.value;
    let filteredCourses;

    if (selectedDuration === "") {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => {
            const hours = course.duration;
            if (selectedDuration === "short") return hours >= 1 && hours <= 2;
            if (selectedDuration === "medium") return hours >2 && hours <= 6;
            if (selectedDuration === "long") return hours > 6;
            return true;
        });
    }

    setResults(filteredCourses);
    setCurrentPage(1); 
};

const handleSortChange = (e) => {
  const order = e.target.value;
  setSortOrder(order);

  const sortedCourses = [...results].sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  setResults(sortedCourses);
  setCurrentPage(1); 
};



    return (
        <div>
            <NavMenu />
            <div className="p-4">
                <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
                 
                    <div className="mx-5">
                        {loading ? (
                            <div className='d-flex justify-content-center'>
                                <Loader />
                            </div>
                        ) : (
                            <div>
                                 <h1 className='fs-1 fw-bold my-5 text-center'>Cursos Disponibles</h1>
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


                            <div className='row'>
                                <div className="mb-3" style={{width:'13%'}}>
                                    <label htmlFor="coursesPerPage" className="form-label"><FontAwesomeIcon icon={faListOl} />  Paginación:</label>
                                    <select 
                                        id="coursesPerPage" 
                                        className="form-select" 
                                        value={coursesPerPage} 
                                        onChange={handleCoursesPerPageChange}
                                    >
                                        <option value={6}>6</option>
                                        <option value={9}>9</option>
                                        <option value={12}>12</option>
                                    </select>
                                </div>


                              <div className="mb-3" style={{width:'14%'}}>
                                <label htmlFor="levelFilter" className="form-label"><FontAwesomeIcon icon={faChartLine} />  Filtrar por nivel:</label>
                                <select 
                                    id="levelFilter" 
                                    className="form-select" 
                                    onChange={handleLevelFilterChange}
                                >
                                    <option value="">Todos</option>
                                    <option value="Basico">Basico</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
                              </div>

                            <div className="mb-3" style={{width:'17%'}}>
                              <label htmlFor="durationFilter" className="form-label"><FontAwesomeIcon icon={faClock} />  Filtrar por duración:</label>
                              <select 
                                  id="durationFilter" 
                                  className="form-select" 
                                  onChange={handleDurationFilterChange}
                              >
                                  <option value="">Todos</option>
                                  <option value="short">1-2 horas</option>
                                  <option value="medium">2-6 horas</option>
                                  <option value="long">Más de 6 horas</option>
                              </select>
                            </div>


                            <div className="mb-3" style={{width:'18%'}}>
                                  <label htmlFor="sortFilter" className="form-label"><FontAwesomeIcon icon={faArrowUpWideShort} /> Ordenar por fecha:</label>
                                  <select 
                                      id="sortFilter" 
                                      className="form-select" 
                                      value={sortOrder} 
                                      onChange={handleSortChange}
                                  >
                                      <option value="desc">Más reciente</option>
                                      <option value="asc">Más antiguo</option>
                                  </select>
                                </div>



                            </div>




                                {currentCourses.length > 0 ? (
                                    <div>
                                        <div className="row row-cols-1 row-cols-md-3 g-4 my-3">
                                            {currentCourses.map((curso) => {
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
                                                                <button onClick={() => handleViewCourse(curso.id)} className="btn btn-primary">Ver curso</button>
                                                            </div>
                                                            <div className="card-footer">
                                                                <small className="text-muted">Subido: {formattedDate}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Pagination totalPages={totalPages} paginate={paginate} currentPage={currentPage} />
                                    </div>
                                ) : (
                                    <div>
                                        <div className="alert alert-info" role="alert">
                                            <FontAwesomeIcon icon={faCircleExclamation}/> No hay Resultados!
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const Pagination = ({ totalPages, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default CourseList;
