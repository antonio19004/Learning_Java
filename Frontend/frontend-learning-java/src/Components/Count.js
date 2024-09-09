import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CountdownAlert = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      onClose();
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown, onClose]);

  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>¡Advertencia!</strong> Quedan {countdown} segundos para cerrar sesión.
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

export default CountdownAlert;
