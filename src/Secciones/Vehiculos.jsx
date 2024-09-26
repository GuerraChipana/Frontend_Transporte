/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [PLACAS_ACTUAL, setPlaca] = useState('');
  const [N_TARJETA, setTarjeta] = useState('');
  const [N_MOTOR, setMotor] = useState('');
  const [MARCA, setMarca] = useState('');
  const [COLOR, setColor] = useState('');
  const [ANIO_DE_COMPRA, setAnioCompra] = useState('');
  const [SEGURO_ID, setSeguroId] = useState('');
  const [ASOCIACION_ID, setAsociacionId] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState({});
  const [segurosSeleccionados, setSegurosSeleccionados] = useState({});

  useEffect(() => {
    fetchData();
    fetchSeguros();
    fetchAsociaciones();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/vehiculo');
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const fetchSeguros = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/seguros');
      setSeguros(response.data);
    } catch (error) {
      console.error('Error al obtener seguros:', error);
    }
  };

  const fetchAsociaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/asociaciones');
      setAsociaciones(response.data);
    } catch (error) {
      console.error('Error al obtener asociaciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehiculoData = {
        PLACAS_ACTUAL,
        N_TARJETA,
        N_MOTOR,
        MARCA,
        COLOR,
        ANIO_DE_COMPRA,
        SEGURO_ID,
        ASOCIACION_ID,
      };

      if (editId) {
        await axios.put(`http://localhost:3002/api/vehiculo/${editId}`, vehiculoData);
        Swal.fire('Actualizado!', 'El vehículo ha sido actualizado.', 'success');
      } else {
        await axios.post('http://localhost:3002/api/vehiculo', vehiculoData);
        Swal.fire('Agregado!', 'El vehículo ha sido agregado.', 'success');
      }

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error al guardar el vehículo:', error);
      Swal.fire('Error!', 'Hubo un problema al guardar el vehículo.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3002/api/vehiculo/${id}`);
        Swal.fire('Eliminado!', 'El vehículo ha sido eliminado.', 'success');
        fetchData();
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        Swal.fire('Error!', 'Hubo un problema al eliminar el vehículo.', 'error');
      }
    }
  };

  const handleEdit = (vehiculo) => {
    setEditId(vehiculo.ID);
    setPlaca(vehiculo.PLACAS_ACTUAL);
    setTarjeta(vehiculo.N_TARJETA);
    setMotor(vehiculo.N_MOTOR);
    setMarca(vehiculo.MARCA);
    setColor(vehiculo.COLOR);
    setAnioCompra(vehiculo.ANIO_DE_COMPRA);
    setSeguroId(vehiculo.SEGURO_ID || '');
    setAsociacionId(vehiculo.ASOCIACION_ID || '');
    setShowModal(true);
  };

  const resetForm = () => {
    setPlaca('');
    setTarjeta('');
    setMotor('');
    setMarca('');
    setColor('');
    setAnioCompra('');
    setSeguroId('');
    setAsociacionId('');
    setEditId(null);
  };

  return (
    <div className="container-fluid">
      <h1>Administración de los Vehículos</h1>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Agregar Vehículo
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>N° Tarjeta</th>
            <th>N° Motor</th>
            <th>Marca</th>
            <th>Color</th>
            <th>Año de Compra</th>
            <th>Seguro</th>
            <th>Asociación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.ID}>
              <td>{vehiculo.ID}</td>
              <td>{vehiculo.PLACAS_ACTUAL}</td>
              <td>{vehiculo.N_TARJETA}</td>
              <td>{vehiculo.N_MOTOR}</td>
              <td>{vehiculo.MARCA}</td>
              <td>{vehiculo.COLOR}</td>
              <td>{vehiculo.ANIO_DE_COMPRA}</td>
              <td>{vehiculo.SEGURO || 'Sin seguro'}</td>
              <td>{vehiculo.ASOCIACION || 'Sin asociación'}</td>
              <td>
                <div className="d-flex justify-content-around">
                  <Button onClick={() => handleEdit(vehiculo)}>
                    <FaEdit />
                  </Button>
                  <Button onClick={() => handleDelete(vehiculo.ID)}>
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
          <Modal.Title>{editId ? 'Editar Vehículo' : 'Agregar Vehículo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Placa', value: PLACAS_ACTUAL, setter: setPlaca },
              { label: 'N° Tarjeta', value: N_TARJETA, setter: setTarjeta },
              { label: 'N ° Motor', value: N_MOTOR, setter: setMotor },
              { label: 'Marca del vehículo', value: MARCA, setter: setMarca },
              { label: 'Color', value: COLOR, setter: setColor },
            ].map(({ label, value, setter, type = 'text' }) => (

              <div className="mb-3" key={label}>
                <label className="form-label">{label}:</label>
                <input type={type} className="form-control" value={value} onChange={(e) => setter(e.target.value)} required />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Año de Compra:</label>
              <input type="number" className="form-control" value={ANIO_DE_COMPRA} onChange={(e) => {
                const year = parseInt(e.target.value, 10);
                if (year >= 0) {
                  setAnioCompra(year);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El año de compra no puede ser negativo',
                    position: 'center',
                    timer: 3000,
                    showConfirmButton: false,
                  });
                }
              }} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Seguro:</label>
              <select className="form-select" value={SEGURO_ID} onChange={(e) => {
                const policyId = e.target.value;
                if (!segurosSeleccionados[policyId]) {
                  setSeguroId(policyId);
                  setSegurosSeleccionados({ ...segurosSeleccionados, [policyId]: true });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Este número de póliza ya está seleccionado',
                    position: 'center',
                    timer: 3000,
                    showConfirmButton: false,
                  });
                }
              }} required>
                <option value="">Selecciona un seguro</option>
                {seguros.map(seguro => (
                  <option key={seguro.id} value={seguro.id}>{seguro.n_poliza}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Asociación:</label>
              <select className="form-select" value={ASOCIACION_ID} onChange={(e) => setAsociacionId(e.target.value)} required>
                <option value="">Selecciona una asociación</option>
                {asociaciones.map(asociacion => (
                  <option key={asociacion.id} value={asociacion.id}>{asociacion.nombre}</option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary">{editId ? 'Actualizar' : 'Agregar'}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Vehiculos;