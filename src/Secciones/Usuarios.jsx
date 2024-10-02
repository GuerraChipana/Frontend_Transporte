/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import debounce from 'lodash/debounce';

function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchDni, setSearchDni] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterUsuarios = () => {
      let filtered = usuarios;

      if (searchDni.trim() !== '') {
        filtered = filtered.filter((usuario) =>
          String(usuario.dni).includes(searchDni.trim())
        );
      }

      if (!showInactive) {
        filtered = filtered.filter((usuario) => usuario.estado === 1);
      }

      setFilteredUsuarios(filtered);
    };

    filterUsuarios();
  }, [searchDni, usuarios, showInactive]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/usuario');
      const sortedUsuarios = response.data.sort((a, b) => a.id - b.id);
      setUsuarios(sortedUsuarios);
      setFilteredUsuarios(sortedUsuarios);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      Swal.fire('Error!', 'Hubo un problema al obtener los datos de usuarios.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contrasena !== confirmarContrasena) {
      Swal.fire('Error!', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    try {
      const payload = { dni, nombre, apellido, usuario, estado: usuarios.find(u => u.id === editId).estado };
      if (contrasena) {
        payload.contrasena = contrasena;
      }

      if (editId) {
        await axios.put(`http://localhost:3002/api/usuario/${editId}`, payload);
        Swal.fire('Actualizado!', 'El usuario ha sido actualizado.', 'success');
      } else {
        await axios.post('http://localhost:3002/api/usuario', payload);
        Swal.fire('Agregado!', 'El usuario ha sido agregado.', 'success');
      }
      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      Swal.fire('Error!', 'Hubo un problema al guardar el usuario.', 'error');
    }
  };

  const handleChangeEstado = async (usuario) => {
    const newEstado = usuario.estado === 1 ? 0 : 1;
    try {
      await axios.patch(`http://localhost:3002/api/usuario/${usuario.id}/estado`, {
        estado: newEstado,
      });
      Swal.fire('Estado Actualizado!', `El usuario ha sido ${newEstado === 1 ? 'activado' : 'desactivado'}.`, 'success');
      fetchData();
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      Swal.fire('Error!', 'Hubo un problema al cambiar el estado del usuario.', 'error');
    }
  };

  const handleEdit = (usuario) => {
    setEditId(usuario.id);
    setDni(usuario.dni);
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setUsuario(usuario.usuario);
    setContrasena(''); // No se muestra la contraseña por seguridad
    setConfirmarContrasena(''); // Resetear confirmación
    setShowModal(true);
  };

  const resetForm = () => {
    setDni('');
    setNombre('');
    setApellido('');
    setUsuario('');
    setContrasena('');
    setConfirmarContrasena('');
    setEditId(null);
  };

  const handleSearchDni = debounce((value) => {
    setSearchDni(value);
  }, 300);

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Usuarios</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Agregar Usuario
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

      <Table striped bordered hover className="table table-responsive">
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.dni}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.usuario}</td>
              <td><samp className={`badge ${usuario.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
              </samp>
              </td>
              <td>
                <div className="d-flex justify-content align-items-center">
                  <Button
                    className="icon-button icon-edit me-2"
                    onClick={() => handleEdit(usuario)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant={usuario.estado === 1 ? 'danger' : 'success'}
                    className="ms-2"
                    onClick={() => handleChangeEstado(usuario)}
                  >
                    {usuario.estado === 1 ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">DNI</label>
              <input
                type="text"
                className="form-control"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmarContrasena" className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                id="confirmarContrasena"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </div>
            <Button variant="primary" type="submit">
              {editId ? 'Actualizar' : 'Agregar'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div >
  );
}

export default Usuario;
