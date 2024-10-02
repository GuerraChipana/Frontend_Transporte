/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { AuthContext } from '../context/AuthContext';

const Asociaciones = () => {
  const { user } = useContext(AuthContext);
  const [asociaciones, setAsociaciones] = useState([]);
  const [filteredAsociaciones, setFilteredAsociaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    obtenerAsociaciones();
  }, []);

  const obtenerAsociaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/asociaciones');
      setAsociaciones(response.data);
      setFilteredAsociaciones(response.data);
    } catch (error) {
      setError('Error al obtener asociaciones');
      Swal.fire('Error', 'Error al obtener asociaciones', 'error');
    }
  };

  const handleSearchNombre = debounce((searchTerm) => {
    const filtered = asociaciones.filter((asociacion) =>
      asociacion.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAsociaciones(filtered);
  }, 500);

  const handleEdit = (asociacion) => {
    setEditId(asociacion.ID);
    setNombre(asociacion.NOMBRE);
    setShowModal(true);
  };

  //CAMBIAR ESTADO
  const handleChangeEstado = async (asociacion) => {
    const nuevoEstado = asociacion.ESTADO === 1 ? 0 : 1;
    try {
      await axios.patch(`http://localhost:3002/api/asociaciones/${asociacion.ID}/estado`, {
        estado: nuevoEstado,
        id_usuario_modificacion: user.id,
      });
      obtenerAsociaciones();
      Swal.fire('Éxito', 'Estado de la asociación actualizado', 'success');
    } catch (error) {
      Swal.fire('Error', 'Error al cambiar el estado de la asociación', 'error');
    }
  };

  //EDICIONES PARA ASOCICIONES
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si el usuario está autenticado
    console.log('Datos de usuario:', user);  // Agrega este log para verificar el valor de user

    if (!user || !user.id) {
      console.error('Usuario no autenticado o ID no disponible');
      Swal.fire('Error', 'Usuario no autenticado o ID no disponible', 'error');
      return;
    }

    try {
      if (editId) {
        const data = JSON.stringify({
          nombre,
          id_usuario_modificacion: user.id,
        });
        await axios.put(`http://localhost:3002/api/asociaciones/${editId}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('Éxito', 'Asociación actualizada exitosamente', 'success');
      } else {
        const data = JSON.stringify({
          nombre,
          id_usuario: user.id,  // Usar el ID del usuario autenticado
        });
        await axios.post('http://localhost:3002/api/asociaciones', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('Éxito', 'Asociación agregada exitosamente', 'success');
      }
      obtenerAsociaciones();
      setShowModal(false);
      setNombre('');
      setEditId(null);
    } catch (error) {
      console.error('Error al enviar el formulario:', error.message);
      Swal.fire('Error', 'Error al agregar o actualizar la asociación', 'error');
    }
  };

  const resetForm = () => {
    setNombre('');
    setEditId(null);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Gestión de Asociaciones</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          Agregar Asociación
        </Button>
        <Form.Control
          type="text"
          placeholder="Buscar por Nombre"
          className="w-50"
          onChange={(e) => handleSearchNombre(e.target.value)}
        />
        <Button variant="secondary" onClick={() => setShowInactive(!showInactive)}>
          {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Table striped bordered hover responsive className="table table-responsive">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAsociaciones.length > 0 ? (
            filteredAsociaciones
              .filter((asociacion) => (showInactive ? true : asociacion.ESTADO === 1))
              .map((asociacion) => (
                <tr key={asociacion.ID}>
                  <td>{asociacion.ID}</td>
                  <td>{asociacion.NOMBRE}</td>
                  <td>
                    <span className={`badge ${asociacion.ESTADO === 1 ? 'bg-success' : 'bg-danger'}`}>
                      {asociacion.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button
                        className="icon-button icon-edit me-3"
                        onClick={() => handleEdit(asociacion)}
                        variant="secondary"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant={asociacion.ESTADO === 1 ? 'danger' : 'success'}
                        className="ms-2"
                        onClick={() => handleChangeEstado(asociacion)}
                      >
                        {asociacion.ESTADO === 1 ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </td>

                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay asociaciones disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </Table>


      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Asociación' : 'Agregar Asociación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editId ? 'Actualizar' : 'Agregar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Asociaciones;
