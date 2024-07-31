import React, {useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth', { user:username, password:password });
            if (response.status === 200) {
                const { message,username,rol } = response.data;
                localStorage.setItem('username', username); 
                localStorage.setItem('rol', rol); 
                navigate('/welcome'); 
            } else {
                setErrorMessage(response.data.message);
            }
           
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Credenciales inválidas');
            } else {
                setErrorMessage('Error desconocido durante la autenticación'); 
            }
            console.error(error);
        }
    };

    return (
        <div>
        <h1>Bienvenidos</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br/>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Login</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default Login;