/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/Login.css';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3002/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contrasena }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            if (data.success) {
                const userData = {
                    id: data.user.ID,              
                    dni: data.user.DNI,            
                    nombre: data.user.NOMBRE,
                    apellido: data.user.APELLIDO,
                    usuario: data.user.USUARIO,
                    estado: data.user.ESTADO,
                };
                login(userData); 
                navigate('/Dashboard/Bienvenida'); 
            } else {
                setError(data.message || 'Credenciales incorrectas.');
            }

        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            setError('Hubo un error en la solicitud.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Iniciar Sesión</h1>
                <div className="form-group">
                    <label htmlFor="usuario">Usuario:</label>
                    <input
                        type="text"
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contrasena">Contraseña:</label>
                    <input
                        type="password"
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Iniciar sesión</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <a href="/" className="back-button">Regresar</a>
        </div>
    );
};

export default Login;
