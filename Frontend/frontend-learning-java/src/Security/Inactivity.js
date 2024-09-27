import { useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const useIdleTimer = (timeout, onIdle = () => {},warningTime = 1000) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (location.pathname === '/login' || location.pathname === '/register') {
        return;
    }
    let idleTimer;
    let warningTimer;

    const handleUserActivity = () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);

      warningTimer = setTimeout(() => {
        alert('Se cerró su sesión por inactividad.');
         
      }, timeout - warningTime);

      idleTimer = setTimeout(() => {
        clearTimeout(warningTimer);
        onIdle();
        localStorage.clear();
        navigate('/login');
      }, timeout);
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    handleUserActivity();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [timeout, warningTime, onIdle, navigate,location.pathname]);
};

export default useIdleTimer;
