import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeleteCourseButton({ courseId }) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/course/delete/${courseId}`,{withCredentials:true});
            navigate('/courses');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleDelete} className="btn btn-danger btn-sm">
            Delete
        </button>
    );
}

export default DeleteCourseButton;
