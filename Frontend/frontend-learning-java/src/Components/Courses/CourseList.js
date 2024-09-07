import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/course/list',{withCredentials:true});
                setCourses(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Courses</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td>
                            <td>{course.duration}</td>
                            <td>{course.level}</td>
                            <td>
                                <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                                    View
                                </Link>
                                <Link to={`/courses/edit/${course.id}`} className="btn btn-warning btn-sm ml-2">
                                    Edit
                                </Link>
                                <button className="btn btn-danger btn-sm ml-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseList;
