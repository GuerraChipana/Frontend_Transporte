/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import debounce from 'lodash/debounce';

function Seguro_vehicular() {
  const [seguros, setSeguros] = useState([]);
  const [filteredSeguros, setFilteredSeguros] = useState([]);
  const [aseguradora, setAseguradora] = useState('');
  const [nPoliza, setNPoliza] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchPoliza, setSearchPoliza] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterSeguros = () => {
      if (searchPoliza.trim() === '') {
        setFilteredSeguros(seguros);
      } else {
        const filtered = seguros.filter((seguro) =>
          seguro.n_poliza.toString().includes(searchPoliza.trim())
        );
        setFilteredSeguros(filtered);
      }
    };

    filterSeguros();
  }, [searchPoliza, seguros]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/seguros');
      const sortedSeguros = response.data.sort((a, b) => a.id - b.id);
      setSeguros(sortedSeguros);
      setFilteredSeguros(sortedSeguros);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      Swal.fire('Error!', 'Hubo un problema al obtener los datos de seguros.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3002/api/seguros/${editId}`, {
          aseguradora,
          n_poliza: nPoliza,
          vigencia,
        });
        Swal.fire('Actualizado!', 'El seguro vehicular ha sido actualizado.', 'success');
      } else {
        await axios.post('http://localhost:3002/api/seguros', {
          aseguradora,
          n_poliza: nPoliza,
          vigencia,
        });
        Swal.fire('Agregado!', 'El seguro vehicular ha sido agregado.', 'success');
      }
      resetForm();
      setShowModal(false);
      fetchData(); 
    } catch (error) {
      console.error('Error al guardar el seguro vehicular:', error);
      Swal.fire('Error!', 'Hubo un problema al guardar el seguro vehicular.', 'error');
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
        await axios.delete(`http://localhost:3002/api/seguros/${id}`);
        Swal.fire('Eliminado!', 'El seguro vehicular ha sido eliminado.', 'success');
        fetchData(); 
      } catch (error) {
        console.error('Error al eliminar seguro vehicular:', error);
        Swal.fire('Error!', 'Hubo un problema al eliminar el seguro vehicular.', 'error');
      }
    }
  };

  const handleEdit = (seguro) => {
    setEditId(seguro.id);
    setAseguradora(seguro.aseguradora);
    setNPoliza(seguro.n_poliza);
    setVigencia(seguro.vigencia);
    setShowModal(true);
  };

  const resetForm = () => {
    setAseguradora('');
    setNPoliza('');
    setVigencia('');
    setEditId(null);
  };

  const handleSearchPoliza = debounce((value) => {
    setSearchPoliza(value);
  }, 300);

  //Funcion para convertir la fecha en formato local
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
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
          placeholder="Buscar por N° de Póliza"
          className="w-50"
          onChange={(e) => handleSearchPoliza(e.target.value)}
        />
      </div>

      <Table striped bordered hover className="table table-responsive">
        <thead>
          <tr>
            <th>ID</th>
            <th>Aseguradora</th>
            <th>N° de Póliza</th>
            <th>Vigencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSeguros.map((seguro) => (
            <tr key={seguro.id}>
              <td>{seguro.id}</td>
              <td>{seguro.aseguradora}</td>
              <td>{seguro.n_poliza}</td>
              <td>{formatDate(seguro.vigencia)}</td>
              <td>
                <div className="d-flex justify-content-around">
                  <Button
                    className="icon-button icon-edit"
                    onClick={() => handleEdit(seguro)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    className="icon-button icon-delete"
                    onClick={() => handleDelete(seguro.id)}
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
          <Modal.Title>{editId ? 'Editar Seguro Vehicular' : 'Agregar Seguro Vehicular'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="aseguradora" className="form-label">Aseguradora</label>
              <input
                type="text"
                className="form-control"
                id="aseguradora"
                value={aseguradora}
                onChange={(e) => setAseguradora(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nPoliza" className="form-label">N° de Póliza</label>
              <input
                type="number"
                className="form-control"
                id="nPoliza"
                value={nPoliza}
                onChange={(e) => setNPoliza(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="vigencia" className="form-label">Vigencia</label>
              <input
                type="date"
                className="form-control"
                id="vigencia"
                value={vigencia}
                onChange={(e) => setVigencia(e.target.value)}
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

export default Seguro_vehicular;
