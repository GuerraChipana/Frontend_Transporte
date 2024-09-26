/* eslint-disable no-unused-vars */
/* Login.jsx */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa el contexto
import '../style/Login.css';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useContext(AuthContext); // Usa el contexto de autenticación

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3002/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data); // Verifica los datos recibidos

            if (data.success) {
                login(); // Marca como autenticado
                navigate('/Dashboard'); // Navega al Dashboard
            } else {
                setError(data.message || 'Credenciales incorrectas.');
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error); // Agrega más información en caso de error
            setError('Hubo un error en la solicitud.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Iniciar Sesión</h1>
                <div className="form-group">
                    <label htmlFor="name">Usuario:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
