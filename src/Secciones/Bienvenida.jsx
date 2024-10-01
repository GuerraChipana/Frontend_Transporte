/* eslint-disable react/no-unknown-property */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faUserCircle, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function Bienvenida() {
    const { user } = useContext(AuthContext);

    if (!user || !user.dni) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
                <p>Cargando datos del usuario...</p>
            </div>
        );
    }

    return (
        <div className="container h-100 d-flex flex-column justify-content-center">
            <div className="text-center mb-4 d-flex align-items-center justify-content-center">
                <img
                    src="/img/escudo-icon.png"
                    alt="icon"
                    className="me-2"
                    style={{ width: '80px', verticalAlign: 'middle' }} // Aumentar tamaño
                />
                <h2 className="text-dark mb-0">Bienvenido al Sistema de Transporte</h2>
            </div>
            <h2 className="text-center text-dark mb-4">Tupac Amaru Inca</h2>

            <div className="row justify-content-center">
                <div className="col-md-10"> {/* Aumentar el tamaño del cuadro */}
                    <div className="card shadow-lg border-primary">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-4">
                                <FontAwesomeIcon icon={faUser} /> Detalles del Usuario
                            </h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="text-secondary">
                                        <FontAwesomeIcon icon={faIdCard} /> <strong>DNI:</strong> {user.dni}
                                    </p>
                                    <p className="text-secondary">
                                        <FontAwesomeIcon icon={faUser} /> <strong>Nombre:</strong> {user.nombre}
                                    </p>
                                    <p className="text-secondary">
                                        <FontAwesomeIcon icon={faUser} /> <strong>Apellido:</strong> {user.apellido}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-secondary">
                                        <FontAwesomeIcon icon={faUserCircle} /> <strong>Usuario:</strong> {user.usuario}
                                    </p>
                                    <p>
                                        {user.estado === 1 ? (
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                                        ) : (
                                            <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                                        )}
                                        <strong> Estado:</strong> {user.estado === 1 ? 'Activo' : 'Inactivo'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .container {
                    margin-top: 0;
                }

                .card {
                    border-radius: 10px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }

                .card-title {
                    font-size: 2rem;
                    color: #333; /* Changed to a darker color for better readability */
                    font-weight: bold;
                    border-bottom: 2px solid #007BFF;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }

                p {
                    font-size: 1.1rem;
                    color: #555; /* Softer color for paragraph text */
                }

                .spinner-border {
                    color: #007BFF; /* Retained blue for loading spinner */
                }

                .text-success {
                    font-size: 1.5rem;
                    color: #28a745; /* Green for active status */
                }

                .text-danger {
                    font-size: 1.5rem;
                    color: #dc3545; /* Changed to Bootstrap's danger color */
                }

                @media (max-width: 768px) {
                    .card-title {
                        font-size: 1.75rem; /* Slightly smaller on mobile */
                    }

                    p {
                        font-size: 1rem; /* Maintain smaller font size on mobile */
                    }
                }
            `}</style>
        </div>
    );
}

export default Bienvenida;
