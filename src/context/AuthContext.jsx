/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Define el AuthContext una sola vez
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Solo exportas el AuthContext una vez, aquí
export { AuthContext };
