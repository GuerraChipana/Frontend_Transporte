// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit, FaKey } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { AuthContext } from '../context/AuthContext';

function Usuario() {
  const { user } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [searchDni, setSearchDni] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [rol, setRol] = useState(1); // Default to superadministrador

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

    try {
      const payload = {
        dni,
        nombre,
        apellido,
        usuario,
        contrasena,
        rol,
        idUsuarioCreador: user.id 
      };


      console.log(payload);

      if (editId) {
        await axios.put(`http://localhost:3002/api/usuario/info/${editId}`, {
          ...payload,
          id_usuario_modificacion: user.id,
        });
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


  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { dni, nombre, apellido, rol, idUsuarioModificador: user.id };

      await axios.put(`http://localhost:3002/api/usuario/info/${editId}`, payload);
      Swal.fire('Actualizado!', 'El usuario ha sido actualizado.', 'success');
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error('Error al editar el usuario:', error);
      Swal.fire('Error!', 'Hubo un problema al editar el usuario.', 'error');
    }
  };

  const handleEditPassword = (usuario) => {
    setEditId(usuario.id);
    setUsuario(usuario.usuario);
    setContrasena(''); // Reset password field
    setShowEditPasswordModal(true);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const payload = { usuario, contrasena, idUsuarioModificador: user.id };
      await axios.put(`http://localhost:3002/api/usuario/credenciales/${editId}`, payload);
      Swal.fire('Actualizado!', 'El usuario y contraseña han sido actualizados.', 'success');
      setShowEditPasswordModal(false);
      fetchData();
    } catch (error) {
      console.error('Error al actualizar usuario y contraseña:', error);
      Swal.fire('Error!', 'Hubo un problema al actualizar el usuario.', 'error');
    }
  };

  const handleChangeEstado = async (usuario) => {
    const newEstado = usuario.estado === 1 ? 0 : 1;
    try {
      await axios.patch(`http://localhost:3002/api/usuario/${usuario.id}/estado`, {
        estado: newEstado,
        idUsuarioModificador: user.id,
      });
      Swal.fire('Estado Actualizado!', `El usuario ha sido ${newEstado === 1 ? 'activado' : 'desactivado'}.`, 'success');
      fetchData();
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      Swal.fire('Error!', 'Hubo un problema al cambiar el estado del usuario.', 'error');
    }
  };

  const resetForm = () => {
    setDni('');
    setNombre('');
    setApellido('');
    setUsuario('');
    setContrasena('');
    setEditId(null);
    setRol(1); // Resetear a superadministrador
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
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.dni}</td>
              <td>{usuario.usuario}</td>
              <td>
                <span className={`badge ${usuario.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                  {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>{usuario.rol === 1 ? 'Superadministrador' : 'Administrador'}</td>
              <td>
                <div className="d-flex justify-content align-items-center">
                  <Button
                    className="icon-button icon-edit me-2"
                    onClick={() => {
                      setEditId(usuario.id);
                      setDni(usuario.dni);
                      setNombre(usuario.nombre);
                      setApellido(usuario.apellido);
                      setRol(usuario.rol);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    className="icon-button icon-key me-2"
                    onClick={() => handleEditPassword(usuario)}
                  >
                    <FaKey />
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

      {/* Modal para agregar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="dni">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="usuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="contrasena">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={rol}
                onChange={(e) => setRol(Number(e.target.value))}
              >
                <option value={1}>Superadministrador</option>
                <option value={2}>Administrador</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="dni">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={rol}
                onChange={(e) => setRol(Number(e.target.value))}
              >
                <option value={1}>Superadministrador</option>
                <option value={2}>Administrador</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar contraseña */}
      <Modal show={showEditPasswordModal} onHide={() => setShowEditPasswordModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario y Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPassword}>
            <Form.Group controlId="usuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="contrasena">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Usuario;
