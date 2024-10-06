// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faUserCircle, faCheckCircle, faTimesCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import '../style/Bienvenida.css'; // Import the CSS file

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
        <div className="container-fluid h-100 d-flex flex-column justify-content-center">

            <div className='titulo'>
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
            </div>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
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
                                    <div className="text-secondary">
                                        {user.rol === 1 ? (
                                            <>
                                                <FontAwesomeIcon icon={faStar} className="text-warning font-large" />
                                                <span className="text-dark ms-2"><strong>Superadministrador</strong></span>
                                            </>
                                        ) : user.rol === 2 ? (
                                            <>
                                                <FontAwesomeIcon icon={faUser} className="text-primary font-large" />
                                                <span className="text-dark ms-2"><strong>Administrador</strong></span>
                                            </>
                                        ) : null}
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bienvenida;
