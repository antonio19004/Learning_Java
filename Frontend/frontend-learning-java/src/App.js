import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Security/Login';
import Welcome from './Components/Welcome.js';

function App(){
  const isAuthenticated = localStorage.getItem('username') !== null;
  return (
    <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/welcome" element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
  );
}


export default App;
