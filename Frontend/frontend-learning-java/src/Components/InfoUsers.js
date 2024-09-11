import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import UserImg from '../Static/Img/User.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/InfoUsers.css';

const InfoUsers = () => {
    document.title = 'Usuarios';

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/admin/users', { withCredentials: true })
        .then(response => {
            setUsers(response.data);
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

    return (
        <div>
            <div className="container mt-5">
                {loading ? (
                    <div className='panelcenter'>
                        <Loader />
                    </div>
                ) : (
                    <div>
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
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">No hay usuarios</td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
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
    );
};

export default InfoUsers;
