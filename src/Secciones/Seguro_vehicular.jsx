/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { AuthContext } from '../context/AuthContext';

const SeguroVehicular = () => {
  const { user } = useContext(AuthContext);
  const [seguros, setSeguros] = useState([]);
  const [filteredSeguros, setFilteredSeguros] = useState([]);
  const [aseguradora, setAseguradora] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerSeguros();
  }, []);

  useEffect(() => {
    // Filtrar seguros cuando cambie el estado de showInactive
    if (showInactive) {
      setFilteredSeguros(seguros);
    } else {
      setFilteredSeguros(seguros.filter(seguro => seguro.estado === 1));
    }
  }, [showInactive, seguros]);

  // Función para obtener datos
  const obtenerSeguros = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/seguros');
      setSeguros(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setError('Error al obtener datos de seguros');
      Swal.fire('Error', 'Hubo un problema al obtener los datos de seguros.', 'error');
    }
  };

  const handleSearchAseguradora = debounce((searchTerm) => {
    const filtered = seguros.filter((seguro) =>
      seguro.aseguradora.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSeguros(filtered);
  }, 500);

  // Edición de un seguro
  const handleEdit = (seguro) => {
    setEditId(seguro.id);
    setAseguradora(seguro.aseguradora);
    setShowModal(true);
  };

  // Cambio de estado del seguro
  const handleChangeEstado = async (seguro) => {
    const nuevoEstado = seguro.estado === 1 ? 0 : 1;
    try {
      await axios.patch(`http://localhost:3002/api/seguros/${seguro.id}/estado`, {
        estado: nuevoEstado,
        id_usuario_modificacion: user.id,
      });
      Swal.fire('Éxito', `El seguro vehicular ha sido ${nuevoEstado === 1 ? 'activado' : 'desactivado'}.`, 'success');
      obtenerSeguros();
    } catch (error) {
      console.error('Error al cambiar el estado del seguro vehicular:', error);
      Swal.fire('Error', 'Hubo un problema al cambiar el estado del seguro vehicular.', 'error');
    }
  };

  // Envío de formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user.id) {
      console.error('Usuario no autenticado o ID no disponible');
      Swal.fire('Error', 'Usuario no autenticado o ID no disponible', 'error');
      return;
    }

    const currentDate = new Date().toISOString(); // Obtener la fecha actual en formato ISO

    try {
      if (editId) {
        const data = JSON.stringify({
          aseguradora,
          id_usuario_modificacion: user.id,
        });
        await axios.put(`http://localhost:3002/api/seguros/${editId}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('Éxito', 'Aseguradora actualizada exitosamente', 'success');
      } else {
        const data = JSON.stringify({
          aseguradora,
          id_usuario: user.id,
        });
        await axios.post('http://localhost:3002/api/seguros', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('Éxito', 'Aseguradora agregada exitosamente', 'success');
      }
      obtenerSeguros();
      setShowModal(false);
      setAseguradora('');
      setEditId(null);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      Swal.fire('Error', 'Error al agregar o actualizar la asociación', 'error');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setAseguradora('');
    setEditId(null);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Seguros Vehiculares</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Agregar Seguro Vehicular
        </Button>
        <Form.Control
          type="text"
          placeholder="Buscar por Aseguradora"
          className="w-50"
          onChange={(e) => handleSearchAseguradora(e.target.value)}
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
      <div className="table-responsive" style={{ maxHeight: '90%', overflowY: 'scroll' }}>
        <Table striped bordered hover responsive className="table table-responsive">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Aseguradora</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSeguros.length > 0 ? (
              filteredSeguros.map((seguro) => (
                <tr key={seguro.id}>
                  <td>{seguro.id}</td>
                  <td>{seguro.aseguradora}</td>
                  <td>
                    <span className={`badge ${seguro.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                      {seguro.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button
                        className="icon-button icon-edit me-3" // Aumenté el margen derecho
                        onClick={() => handleEdit(seguro)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant={seguro.estado === 1 ? 'danger' : 'success'}
                        className="ms-2" // Clase de margen izquierdo para el botón
                        onClick={() => handleChangeEstado(seguro)}
                      >
                        {seguro.estado === 1 ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay seguros vehiculares disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Seguro Vehicular' : 'Agregar Seguro Vehicular'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Aseguradora</Form.Label>
              <Form.Control
                type="text"
                value={aseguradora}
                onChange={(e) => setAseguradora(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editId ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SeguroVehicular;
