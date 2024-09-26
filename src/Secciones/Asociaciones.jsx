/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Table, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Asociaciones = () => {
  const [asociacionesList, setAsociacionesList] = useState([]);
  const [asociacionNombre, setAsociacionNombre] = useState('');
  const [asociacionId, setAsociacionId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    obtenerAsociaciones();
  }, []);

  const obtenerAsociaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/asociaciones');
      setAsociacionesList(response.data);
    } catch (error) {
      console.error('Error al obtener las asociaciones:', error);
    }
  };
  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    try {
      if (asociacionId) {
        await axios.put(`http://localhost:3002/api/asociaciones/${asociacionId}`, { nombre: asociacionNombre });
        Swal.fire('Actualizado!', 'La asociación ha sido actualizada correctamente.', 'success');
      } else {
        await axios.post('http://localhost:3002/api/asociaciones', { nombre: asociacionNombre });
        Swal.fire('Agregado!', 'La asociación ha sido agregada correctamente.', 'success');
      }
      limpiarFormulario();
      setIsModalVisible(false);
      obtenerAsociaciones();
    } catch (error) {
      console.error('Error al guardar la asociación:', error);
      Swal.fire('Error!', `Hubo un problema al guardar la asociación: ${error.message}`, 'error');
    }
  };

  const manejarEdicion = (asociacion) => {
    setAsociacionNombre(asociacion.nombre);
    setAsociacionId(asociacion.id);
    setIsModalVisible(true);
  };

  const manejarEliminacion = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3002/api/asociaciones/${id}`);
          Swal.fire('Eliminado!', 'La asociación ha sido eliminada correctamente.', 'success');
          obtenerAsociaciones();
        } catch (error) {
          console.error('Error al eliminar la asociación:', error);
          Swal.fire('Error!', `Hubo un problema al eliminar la asociación: ${error.message}`, 'error');
        }
      }
    });
  };

  const limpiarFormulario = () => {
    setAsociacionNombre('');
    setAsociacionId(null);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Asociación de Motos del Distrito</h1>

      <Button variant="primary" className="mb-3" onClick={() => {
        limpiarFormulario();
        setIsModalVisible(true);
      }}>
        Agregar Asociación
      </Button>

      <Table striped bordered hover className="table-responsive">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asociacionesList
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((asociacion) => (
              <tr key={asociacion.id}>
                <td>{asociacion.id}</td><td>{asociacion.nombre}</td>
                <td>
                  <div className="d-flex justify-content-around">
                    <Button className="icon-button icon-edit" onClick={() => manejarEdicion(asociacion)}>
                      <FaEdit />
                    </Button>
                    <Button className="icon-button icon-delete" onClick={() => manejarEliminacion(asociacion.id)}>
                      <FaTrashAlt />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>


      <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{asociacionId ? 'Editar Asociación' : 'Agregar Asociación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={manejarEnvioFormulario}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="nombre" value={asociacionNombre} onChange={(e) => setAsociacionNombre(e.target.value)} required />
            </div>
            <Button variant="primary" type="submit">
              {asociacionId ? 'Actualizar' : 'Agregar'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Asociaciones;
