import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCourse() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/courses/${id}`);
                setCourse(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/course/update/${id}`, course,{withCredentials:true});
            navigate('/courses');
        } catch (error) {
            console.error(error);
        }
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Edit Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Duration (hours)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={course.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Level</label>
                    <select
                        className="form-control"
                        name="level"
                        value={course.level}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Level</option>
                        <option value="Basico">Basico</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                    </select>
                </div>
                {/* Additional fields for topics, videos, etc., similar to CreateCourse */}
                <button type="submit" className="btn btn-primary">Update Course</button>
            </form>
        </div>
    );
}

export default EditCourse;
