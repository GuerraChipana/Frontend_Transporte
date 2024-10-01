/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: '', // Agregado el ID
        dni: '',
        nombre: '',
        apellido: '',
        usuario: '',
        estado: 0,
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData) => {
        setUser({
            id: userData.id, // Asegúrate de que el ID esté presente en userData
            dni: userData.dni,
            nombre: userData.nombre,
            apellido: userData.apellido,
            usuario: userData.usuario,
            estado: userData.estado,
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser({
            id: '', // Reiniciar ID al cerrar sesión
            dni: '',
            nombre: '',
            apellido: '',
            usuario: '',
            estado: 0,
        });
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext };
