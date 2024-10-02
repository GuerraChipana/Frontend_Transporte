/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import '../style/Secciones.css';
import debounce from 'lodash/debounce';
import { AuthContext } from '../context/AuthContext';


function Propietarios() {
  const { user } = useContext(AuthContext);
  const [propietarios, setPropietarios] = useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [estado, setEstado] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchDni, setSearchDni] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    obtenerPropietarios();
  }, []);

  const obtenerPropietarios = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/propietarios');
      setPropietarios(response.data);
      setFilteredPropietarios(response.data);
    } catch (error) {
      setError('Error al obtener datos de Propietarios');
      Swal.fire('Error', 'Error al obtener datos de Propietarios', 'error');
    }
  };

  const handleSearchDni = debounce((searchTerm) => {
    const filtered = propietarios.filter((propietario) =>
      propietario.dni.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPropietarios(filtered);
  }, 500);

  const handleEdit = (propietario) => {
    setEditId(propietario.id);
    setNombre(propietario.nombre);
    setApellido(propietario.apellido);
    setDni(propietario.dni);
    setTelefono(propietario.telefono);
    setDomicilio(propietario.domicilio);
    setEstado(propietario.estado);
    setShowModal(true);
  };

  const handleChangeEstado = async (propietario) => {
    const nuevoEstado = propietario.estado === 1 ? 0 : 1;
    try {
      await axios.patch(`http://localhost:3002/api/propietarios/${propietario.id}/estado`, {
        estado: nuevoEstado,
        id_usuario_modificacion: user.id,
      });
      obtenerPropietarios();
      Swal.fire('Éxito', 'Estado del propietario actualizado', 'success');
    } catch (error) {
      Swal.fire('Error', 'Error al cambiar el estado del propietario', 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si el usuario está autenticado
    console.log('Datos de usuario:', user);  

    if (!user || !user.id) {
      console.error('Usuario no autenticado o ID no disponible');
      Swal.fire('Error', 'Usuario no autenticado o ID no disponible', 'error');
      return;
    }

    try {
      if (editId) {
        const data = JSON.stringify({
          nombre,
          apellido,
          dni,
          telefono,
          domicilio,
          id_usuario_modificacion: user.id,
        });
        await axios.put(`http://localhost:3002/api/propietarios/${editId}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('Éxito', 'Propietario actualizado exitosamente', 'success');
      } else {
        const data = JSON.stringify({
          nombre,
          apellido,
          dni,
          telefono,
          domicilio,
          idUsuario: user.id,
        });
        await axios.post('http://localhost:3002/api/propietarios', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('Éxito', 'Asociación agregada exitosamente', 'success');
      }
      obtenerPropietarios();
      setShowModal(false);
      setNombre('');
      setApellido('');
      setDni('');
      setTelefono('');
      setDomicilio('');
      setEditId(null);
    } catch (error) {
      console.error('Error al enviar el formulario:', error.message);
      Swal.fire('Error!', 'Error al agregar o actualizar  el propietario.', 'error');
    }
  };

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setDni('');
    setTelefono('');
    setDomicilio('');
    setEditId(null);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Gestión de Propietarios</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Agregar Propietario
        </Button>
        <Form.Control
          type="text"
          placeholder="Buscar por DNI"
          className="w-50"
          onChange={(e) => handleSearchDni(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => setShowInactive(!showInactive)}
        >
          {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
        </Button>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Table striped bordered hover className="table table-responsive">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Domicilio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPropietarios.length > 0 ? (
            filteredPropietarios
              .filter((propietario) => (showInactive ? true : propietario.estado === 1))
              .map((propietario) => (
                <tr key={propietario.id}>
                  <td>{propietario.id}</td>
                  <td>{propietario.nombre}</td>
                  <td>{propietario.apellido}</td>
                  <td>{propietario.dni}</td>
                  <td>{propietario.telefono}</td>
                  <td>{propietario.domicilio}</td>
                  <td>
                    <span className={`badge ${propietario.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                      {propietario.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-around align-items-center">
                      <Button
                        className="icon-button icon-edit"
                        onClick={() => handleEdit(propietario)}
                        variant='secondary'
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant={propietario.estado === 1 ? 'danger' : 'success'}
                        className='ms-2'
                        onClick={() => handleChangeEstado(propietario)}
                      >
                        {propietario.estado === 1 ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay propietarios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Propietario' : 'Agregar Propietario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="number"
                className="form-control"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="number"
                className="form-control"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Domicilio</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="domicilio"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
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
}

export default Propietarios;
