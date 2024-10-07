// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/Dashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars, faHome, faUser, faBuilding, faClipboard,
    faCar, faShieldAlt, faUsers, faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Swal from 'sweetalert2';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [isResponsive] = useState(false);
    const [, setUsuarios] = useState([]);
    const [links, setLinks] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/usuario');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
                Swal.fire('Error!', 'Hubo un problema al obtener los datos de usuarios.', 'error');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const defaultLinks = [
            { to: "Bienvenida", label: "Bienvenida", icon: faHome },
            { to: "Usuario", label: "Usuarios", icon: faUser },
            { to: "Propietarios", label: "Propietarios", icon: faBuilding },
            { to: "Vehiculos", label: "Vehículos", icon: faCar },
            { to: "Seguro_vehicular", label: "Seguro vehicular", icon: faShieldAlt },
            { to: "Asociaciones", label: "Asociaciones", icon: faUsers },
            { to: "#", label: "Registro del sistema", icon: faClipboard },
            { to: "/login", label: "Salir", icon: faSignOutAlt }
        ];


        if (user && user.rol === 1) {
            setLinks(defaultLinks);
        } else {
            setLinks(defaultLinks.filter(link => link.to !== "Usuario"));
        }

    }, [user]);

    const toggleSidebar = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div className={`dashboard-container ${collapsed && isResponsive ? 'sidebar-collapse-up' : collapsed ? 'sidebar-collapsed' : ''}`}>
            <div className={`sidebar ${collapsed && isResponsive ? 'collapse-up' : collapsed ? 'collapsed' : ''}`}>
                <nav className="d-flex justify-content-center align-items-center navbar navbar-responsive" style={{ height: '60px' }}>
                    <div
                        className="navbar-brand d-flex justify-content-center align-items-center"
                        onClick={toggleSidebar}
                        style={{ cursor: 'pointer', padding: '10px', paddingLeft: '25px', flexGrow: 1 }}
                    >
                        <FontAwesomeIcon icon={faBars} size="lg" color="#fff" />
                    </div>
                </nav>

                <ul className="nav flex-column">
                    {links.map(({ to, label, icon }) => (
                        <li key={to} className="nav-item" style={{ margin: '5px 0' }}>
                            <Link to={to} className="nav-link" title={label}>
                                <FontAwesomeIcon icon={icon} aria-label={label} />
                                {!collapsed && <span className="nav-text">{label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="dashboard-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
