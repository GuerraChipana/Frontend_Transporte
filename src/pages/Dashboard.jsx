/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../style/Dashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHouse, faUser, faBuilding, faCar, faFileInvoice, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);


    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`dashboard-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <a href="#" className="d-block p-3 link-dark text-decoration-none" title="Icon-only" data-bs-toggle="tooltip" data-bs-placement="right">
                    <svg className="bi" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                    <span className="visually-hidden">Icon-only</span>
                </a>

                <ul className="nav nav-pills nav-flush flex-column mb-auto text-start">
                    <li className="nav-item">
                        <Link to="Bienvenida" className="nav-link py-3 border-bottom" title="Bienvenida" data-bs-toggle="tooltip" data-bs-placement="right">
                            <FontAwesomeIcon icon={faHouse} aria-label="Bienvenida" />
                            {!collapsed && <span className="nav-text">Bienvenida</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="Usuario" className="nav-link py-3 border-bottom" title="Usuarios" data-bs-toggle="tooltip" data-bs-placement="right">
                            <FontAwesomeIcon icon={faUser} aria-label="Usuarios" />
                            {!collapsed && <span className="nav-text">Usuarios</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="Propietarios" className="nav-link py-3 border-bottom" title="Propietarios" data-bs-toggle="tooltip" data-bs-placement="right">
                            <FontAwesomeIcon icon={faBuilding} aria-label="Propietarios" />
                            {!collapsed && <span className="nav-text">Propietarios</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="Vehiculos" className="nav-link py-3 border-bottom" title="Vehículos" data-bs-toggle="tooltip" data-bs-placement="right">
                            <FontAwesomeIcon icon={faCar} aria-label="Vehiculos" />
                            {!collapsed && <span className="nav-text">Vehículos</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="Seguro_vehicular" className="nav-link py-3 border-bottom" title="Seguro vehicular" data-bs-toggle="tooltip" data-bs-placement="right">
                            <FontAwesomeIcon icon={faFileInvoice} aria-label="Seguro vehicular" />
                            {!collapsed && <span className="nav-text">Seguro vehicular</span>}
                        </Link>
                    </li>
                    <Link to="Asociaciones" className="nav-link py-3 border-bottom" title="Asociaciones" data-bs-toggle="tooltip" data-bs-placement="right">
                        <FontAwesomeIcon icon={faFileInvoice} aria-label="Asociaciones" />
                        {!collapsed && <span className="nav-text">Asociaciones</span>}
                    </Link>
                    <li>
                        <Link to="#" className="nav-link py-3 border-bottom" title="Registro del sistema" data-bs-toggle="tooltip" data-bs-placement="right">
                            <FontAwesomeIcon icon={faCog} aria-label="Registro del sistema" />
                            {!collapsed && <span className="nav-text">Registro del sistema</span>}
                        </Link>
                    </li>
                </ul>
                <div className="sidebar-toggle" onClick={toggleSidebar}>
                    <div className="toggle-icon">
                        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} size="lg" color="#fff" />
                    </div>
                </div>
                <div className="dropdown border-top mt-auto">
                    <a href="#" className="d-flex align-items-center justify-content-center p-3 text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                        <FontAwesomeIcon icon={faUser} />
                    </a>
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
                        <li><a className="dropdown-item" href="/login"><FontAwesomeIcon icon={faSignOutAlt} /> Salir</a></li>
                    </ul>
                </div>
            </div>
            <div className="dashboard-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
