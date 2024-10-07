/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { AuthContext } from '../context/AuthContext';
import { obtenerAsociaciones, handleSubmit, handleChangeEstado } from '../log/AsociacionesLogica';

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
    obtenerAsociaciones(setAsociaciones, setFilteredAsociaciones, setError);
  }, []);

  const handleSearchNombre = debounce((searchTerm) => {
    const filtered = asociaciones.filter((asociacion) =>
      asociacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAsociaciones(filtered);
  }, 500);

  const handleEdit = (asociacion) => {
    setEditId(asociacion.id);
    setNombre(asociacion.nombre);
    setShowModal(true);
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

      <div className="table-responsive" style={{ maxHeight: '83%', overflowY: 'scroll' }}>
        <Table>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th >Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredAsociaciones.length > 0 ? (
              filteredAsociaciones
                .filter((asociacion) => (showInactive ? true : asociacion.estado === 1))
                .map((asociacion) => (
                  <tr key={asociacion.id}>
                    <td className='text-center'>{asociacion.id}</td>
                    <td>{asociacion.nombre}</td>
                    <td>
                      <span className={`badge ${asociacion.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                        {asociacion.estado === 1 ? 'Activo' : 'Inactivo'}
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
                          variant={asociacion.estado === 1 ? 'danger' : 'success'}
                          className="ms-2"
                          onClick={() => handleChangeEstado(
                            asociacion, user, obtenerAsociaciones, setAsociaciones,
                            setFilteredAsociaciones, setError)}
                        >
                          {asociacion.estado === 1 ? 'Desactivar' : 'Activar'}
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
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Asociación' : 'Agregar Asociación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => handleSubmit(event, editId, nombre, user, () =>
            obtenerAsociaciones(setAsociaciones, setFilteredAsociaciones, setError),
            resetForm, setShowModal, setNombre, setEditId)}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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

export default Asociaciones;
