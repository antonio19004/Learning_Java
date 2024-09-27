import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import UserImg from '../Static/Img/User.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/InfoUsers.css';

const InfoUsers = () => {
    document.title = 'Usuarios';

    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        axios.get('https://backend-learning-java.onrender.com/admin/users', { withCredentials: true })
        .then(response => {
            setUsers(response.data);
            setResults(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.trim() === '') {
            setResults(users);
        } else {
            const filteredResults = users.filter(us => 
                us.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        }
    };

    return (
        <div>
            <div className='shadow bg-light px-5 pb-5 pt-5 rounded'>
            <div>
                {loading ? (
                     <div className='d-flex justify-content-center'>
                     <Loader />
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
                            placeholder="Buscar usuarios por nombre..." 
                            aria-label="Buscar usuarios por nombre..." 
                            aria-describedby="basic-addon1"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>


                        <h2 style={{ marginBottom: '25px' }}><FontAwesomeIcon icon={faList} style={{ marginRight: '10px' }} />  Información de Usuarios</h2>
                        <span className="badge bg-info p-2 my-2">Usuarios Registrados: {users.length + 1}</span>
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Imagen de Perfil</th>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">No hay usuarios</td>
                                        </tr>
                                    ) : (
                                        results.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img src={user.imagenPerfil ? `data:image/jpeg;base64,${user.imagenPerfil}` : UserImg} alt="Perfil" className="rounded-circle me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                                </td>
                                                <td>{`${user.nombre} ${user.apellido}`}</td>
                                                <td>{calculateAge(user.fechaNacimiento)}</td>
                                                <td>{user.email}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            </div>

        </div>
    );
};

export default InfoUsers;
