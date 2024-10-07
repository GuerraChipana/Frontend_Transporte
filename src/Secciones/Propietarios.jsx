// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/AuthContext';
import { obtenerPropietarios, handleChangeEstado, handleSubmit } from '../log/PropietariosLogica';
import '../style/Secciones.css';

function Propietarios() {
  const { user } = useContext(AuthContext);
  const [propietarios, setPropietarios] = useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  // Ejecutamos solo al montar el componente
  useEffect(() => {
    obtenerPropietarios(setPropietarios, setFilteredPropietarios, setError);
  }, []);

  const handleSearchDni = debounce((searchTerm) => {
    const filtered = propietarios.filter((propietario) =>
      propietario.dni.toString().includes(searchTerm)
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

  // Función actualizada para manejar el submit y luego actualizar la tabla automáticamente
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      await handleSubmit(
        event,
        editId,
        nombre,
        apellido,
        dni,
        telefono,
        domicilio,
        user,
        obtenerPropietarios,
        propietarios,
        resetForm,
        setShowModal,
        setNombre,
        setApellido,
        setDni,
        setTelefono,
        setDomicilio,
        setEditId,
        filteredPropietarios,
        setPropietarios,
        setFilteredPropietarios,
        setError
      );
      obtenerPropietarios(setPropietarios, setFilteredPropietarios, setError);
      resetForm();
      setShowModal(false);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Ocurrió un error al agregar o actualizar el propietario');
    }
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
          maxLength={8}
          onChange={(e) => handleSearchDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
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

      <div className="table-responsive" style={{ maxHeight: '83%', overflowY: 'scroll' }}>
        <Table>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Domicilio</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
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
                    <td>{propietario.telefono ? propietario.telefono : 'Sin teléfono'}</td>
                    <td>{propietario.domicilio ? propietario.domicilio : 'Sin domicilio'}</td>
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
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant={propietario.estado === 1 ? 'danger' : 'success'}
                          className='ms-2'
                          onClick={() => handleChangeEstado(
                            propietario,
                            user,
                            obtenerPropietarios,
                            setPropietarios,
                            setFilteredPropietarios,
                            setError
                          )}
                        >
                          {propietario.estado === 1 ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No se encontraron propietarios
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Propietario' : 'Agregar Propietario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitForm}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Ingrese nombre"
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
                placeholder="Ingrese apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                className={`form-control ${dni.length !== 8 && dni ? 'is-invalid' : ''}`}
                placeholder="Ingrese DNI"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                onBlur={() => dni.length !== 8 && setDni('')}
                required
                style={{ appearance: 'none', MozAppearance: 'textfield' }}
              />
              {dni.length !== 8 && dni && <div className="invalid-feedback">DNI debe tener 8 dígitos.</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="number"
                className="form-control"
                id="telefono"
                placeholder="Ingrese teléfono"
                value={telefono}
                onChange={(e) => {
                  const maxLength = 9;
                  const inputValue = e.target.value;
                  if (inputValue.length > maxLength) {
                    e.target.value = inputValue.slice(0, maxLength);
                  } else {
                    setTelefono(e.target.value);
                  }
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Domicilio</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Ingrese domicilio"
                id="domicilio"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
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
