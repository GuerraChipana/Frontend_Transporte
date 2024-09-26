/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../style/Secciones.css';
import debounce from 'lodash/debounce';

function Propietarios() {
  const [propietarios, setPropietarios] = useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchDni, setSearchDni] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterPropietarios = () => {
      if (searchDni.trim() === '') {
        setFilteredPropietarios(propietarios);
      } else {
        const filtered = propietarios.filter((propietario) =>
          propietario.dni.toString().includes(searchDni.trim())
        );
        setFilteredPropietarios(filtered);
      }
    };

    filterPropietarios();
  }, [searchDni, propietarios]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/propietarios');
      const sortedPropietarios = response.data.sort((a, b) => a.id - b.id);
      setPropietarios(sortedPropietarios);
      setFilteredPropietarios(sortedPropietarios);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3002/api/propietarios/${editId}`, {
          nombre,
          apellido,
          dni,
          telefono,
          domicilio,
        });
        Swal.fire('Actualizado!', 'El propietario ha sido actualizado.', 'success');
      } else {
        await axios.post('http://localhost:3002/api/propietarios', {
          nombre,
          apellido,
          dni,
          telefono,
          domicilio,
        });
        Swal.fire('Agregado!', 'El propietario ha sido agregado.', 'success');
      }
      resetForm();
      setShowModal(false);
      fetchData(); // Actualiza la lista de propietarios
    } catch (error) {
      console.error('Error al guardar el propietario:', error);
      Swal.fire('Error!', 'Hubo un problema al guardar el propietario.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3498db',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3002/api/propietarios/${id}`);
        Swal.fire('Eliminado!', 'El propietario ha sido eliminado.', 'success');
        fetchData(); // Actualiza la lista de propietarios
      } catch (error) {
        console.error('Error al eliminar propietario:', error);
        Swal.fire('Error!', 'Hubo un problema al eliminar el propietario.', 'error');
      }
    }
  };

  const handleEdit = (propietario) => {
    setEditId(propietario.id);
    setNombre(propietario.nombre);
    setApellido(propietario.apellido);
    setDni(propietario.dni);
    setTelefono(propietario.telefono);
    setDomicilio(propietario.domicilio);
    setShowModal(true);
  };

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setDni('');
    setTelefono('');
    setDomicilio('');
    setEditId(null);
  };

  const handleSearchDni = debounce((value) => {
    setSearchDni(value);
  }, 300);

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
      </div>

      <Table striped bordered hover className="table table-responsive">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Domicilio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPropietarios.map((propietario) => (
            <tr key={propietario.id}>
              <td>{propietario.id}</td>
              <td>{propietario.nombre}</td>
              <td>{propietario.apellido}</td>
              <td>{propietario.dni}</td>
              <td>{propietario.telefono}</td>
              <td>{propietario.domicilio}</td>
              <td>
                <div className="d-flex justify-content-around">
                  <Button
                    className="icon-button icon-edit"
                    onClick={() => handleEdit(propietario)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    className="icon-button icon-delete"
                    onClick={() => handleDelete(propietario.id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Propietario' : 'Agregar Propietario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="dni" className="form-label">DNI</label>
              <input
                type="number"
                className="form-control"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input
                type="number"
                className="form-control"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="domicilio" className="form-label">Domicilio</label>
              <input
                type="text"
                className="form-control"
                id="domicilio"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                required
              />
            </div>
            <Button variant="primary" type="submit">
              {editId ? 'Actualizar' : 'Agregar'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Propietarios;
