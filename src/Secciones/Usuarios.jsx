/* eslint-disable react-hooks/exhaustive-deps */
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
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [searchDni, setSearchDni] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [rol, setRol] = useState(1);
  const [editDni, setEditDni] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [editApellido, setEditApellido] = useState('');
  const [editRol, setEditRol] = useState(1);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter users when search or showInactive changes
  useEffect(() => {
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple de contraseña
    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire('Error!', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    try {
      const payload = {
        dni, nombre, apellido, usuario, contrasena: nuevaContrasena,
        rol, idUsuarioCreador: user.id,
      };

      if (editId) {
        // Editar usuario
        await axios.put(`http://localhost:3002/api/usuario/info/${editId}`, {
          ...payload,
          idUsuarioModificador: user.id,
        });
        Swal.fire('Actualizado!', 'El usuario ha sido actualizado.', 'success');
      } else {
        // Crear nuevo usuario
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
      const payload = {
        dni: editDni, nombre: editNombre, apellido: editApellido,
        rol: editRol, idUsuarioModificador: user.id,
      };

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
    setNuevaContrasena('');
    setConfirmarContrasena('');
    setShowEditPasswordModal(true);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire('Error!', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    try {
      const payload = {
        usuario: usuario, contrasenaActual: contrasenaActual,
        contrasenaNueva: nuevaContrasena, contrasenaConfirmacion: confirmarContrasena,
        idUsuarioModificador: user.id,
      };

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
        estado: newEstado, idUsuarioModificador: user.id,
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
    setNuevaContrasena('');
    setConfirmarContrasena('');
    setEditId(null);
    setRol(1);
  };

  const handleSearchDni = debounce((value) => {
    setSearchDni(value);
  }, 300);

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Usuarios</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}  >
          Agregar Usuario
        </Button>
        <Form.Control type="text" placeholder="Buscar por DNI" className="w-50"
          onChange={(e) => handleSearchDni(e.target.value)} />
        <Button variant="secondary" onClick={() => setShowInactive(!showInactive)}>
          {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
        </Button>
      </div>
      <div className="table-responsive" style={{ maxHeight: '83%', overflowY: 'scroll' }}>
        <Table >
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <tr className='text-center'>
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
          <tbody >
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className='text-center'>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.dni}</td>
                <td>{usuario.usuario}</td>
                <td>
                  <span className={`badge ${usuario.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                    {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className='text-center'>{usuario.rol === 1 ? 'Superadministrador' : 'Administrador'}</td>
                <td>
                  <div className="d-flex justify-content align-items-center">
                    <Button
                      className="icon-button icon-edit me-2"
                      onClick={() => {
                        setEditId(usuario.id);
                        setEditDni(usuario.dni);
                        setEditNombre(usuario.nombre);
                        setEditApellido(usuario.apellido);
                        setEditRol(usuario.rol);
                        setShowEditModal(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      className="icon-button icon-password me-2"
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
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={dni}
                onChange={(e) => {
                  const value = e.target.value;
                  // Verifica si la longitud es menor o igual a 8 y es un número
                  if (value.length <= 8 && /^\d*$/.test(value)) {
                    setDni(value);
                  }
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={rol}
                onChange={(e) => setRol(parseInt(e.target.value))}
                required
              >
                <option value={1}>Superadministrador</option>
                <option value={2}>Administrador</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Agregar Usuario
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={editDni}
                onChange={(e) => {
                  if (e.target.value.length <= 8 && /^\d*$/.test(e.target.value)) {
                    setEditDni(e.target.value);
                  }
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={editApellido}
                onChange={(e) => setEditApellido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={editRol}
                onChange={(e) => setEditRol(parseInt(e.target.value))}
                required
              >
                <option value={1}>Superadministrador</option>
                <option value={2}>Administrador</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showEditPasswordModal} onHide={() => setShowEditPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPassword}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Usuario;