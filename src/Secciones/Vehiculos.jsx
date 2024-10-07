/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { AuthContext } from '../context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import moment from 'moment';
registerLocale("es", es);

const Vehiculos = () => {
  const { user } = useContext(AuthContext);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [error, setError] = useState(null);

  const [optionsPropietarios, setOptionsPropietarios] = useState([]);
  const [optionsAsociaciones, setOptionsAsociaciones] = useState([]);
  const [optionsSegurosVehiculares, setOptionsSegurosVehiculares] = useState([]);

  const [propietarios, setPropietarios] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [asociacion, setAsociacion] = useState([]);

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState({
    id: '',
    placa: '',
    nTarjeta: '',
    nMotor: '',
    marca: '',
    anoDeCompra: '',
    seguroId: '',
    nPoliza: '',
    fechaVigenciaDesde: '',
    fechaVigenciaHasta: '',
    propietario1Id: '',
    propietario2Id: '',
    asociacionId: '',
    color: '',
  });

  const [placa, setPlaca] = useState('');
  const [nTarjeta, setNTarjeta] = useState('');
  const [nMotor, setNMotor] = useState('');
  const [marca, setMarca] = useState('');
  const [anoDeCompra, setAnoDeCompra] = useState('');
  const [seguroId, setSeguroId] = useState('');
  const [nPoliza, setNPoliza] = useState('');
  const [fechaVigenciaDesde, setFechaVigenciaDesde] = useState('');
  const [fechaVigenciaHasta, setFechaVigenciaHasta] = useState('');
  const [propietario1Id, setPropietario1Id] = useState('');
  const [propietario2Id, setPropietario2Id] = useState('');
  const [asociacionId, setAsociacionId] = useState('');
  const [color, setColor] = useState('');
  const [showModalVer, setShowModalVer] = useState(false);
  const [vehiculoVer, setVehiculoVer] = useState({});

  const [fechaVigenciaDesdeVer, setFechaVigenciaDesdeVer] = useState('');
  const [fechaVigenciaHastaVer, setFechaVigenciaHastaVer] = useState('');

  const handleVerVehiculo = (vehiculo) => {
    console.log("Se llamó a handleVerVehiculo");
    setVehiculoVer(vehiculo);
    setFechaVigenciaDesdeVer(formatDate(vehiculo.FECHA_VIGENCIA_DESDE));
    setFechaVigenciaHastaVer(formatDate(vehiculo.FECHA_VIGENCIA_HASTA));
    setShowModalVer(true);
  };


  useEffect(() => {
    obtenerVehiculos();
    obtenerPropietarios();
    obtenerAsociaciones();
    obtenerSegurosVehiculares();
  }, []);

  useEffect(() => {
    // Filtrar vehículos cuando cambie el estado de showInactive
    if (showInactive) {
      setFilteredVehiculos(vehiculos);
    } else {
      setFilteredVehiculos(vehiculos.filter(vehiculo => vehiculo.ESTADO === 1));
    }
  }, [showInactive, vehiculos]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


  const obtenerVehiculos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/vehiculo');
      const vehiculosData = response.data.data.map(vehiculo => {
        return {
          ...vehiculo,
          SEGURO_NOMBRE: vehiculo.SEGURO_ID,
          ASOCIACION_NOMBRE: vehiculo.ASOCIACION_ID,
          PROPIETARIO_1_DNI: vehiculo.PROPIETARIO_1_ID,
          PROPIETARIO_2_DNI: vehiculo.PROPIETARIO_2_ID
        };
      });
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setError('Error al obtener datos de vehículos');
      Swal.fire('Error', 'Hubo un problema al obtener los datos de vehículos.', 'error');
    }
  };

  const obtenerPropietarios = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/propietarios');

      // Filtrar los propietarios que tienen estado igual a 1
      const propietariosFiltrados = response.data.filter(propietario => propietario.estado === 1);

      // Mapear los propietarios filtrados a opciones de selección
      const options = propietariosFiltrados.map(propietario => ({
        value: propietario.dni,
        label: propietario.dni,
      }));

      setOptionsPropietarios(options);
      setPropietarios(propietariosFiltrados); // Guardar datos de los propietarios filtrados
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
    }
  };


  const obtenerAsociaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/asociaciones');

      // Ver los datos originales para depurar
      console.log('Datos recibidos:', response.data);

      // Filtrar las asociaciones que tienen estado igual a 1 (comparación flexible)
      const asociacionesFiltradas = response.data.filter(asociacion => asociacion.estado == 1);

      // Mapear las asociaciones filtradas a opciones de selección
      const options = asociacionesFiltradas.map(asociacion => ({
        value: asociacion.nombre,
        label: asociacion.nombre,
      }));

      setOptionsAsociaciones(options);
      setAsociacion(asociacionesFiltradas); // Guardar datos de las asociaciones filtradas
    } catch (error) {
      console.error('Error al obtener asociaciones:', error);
    }
  };


  const obtenerSegurosVehiculares = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/seguros');

      // Filtrar los seguros que tienen estado igual a 1
      const segurosFiltrados = response.data.filter(seguro => seguro.estado === 1);

      // Mapear los seguros filtrados a opciones de selección
      const options = segurosFiltrados.map(seguro => ({
        value: seguro.aseguradora,
        label: seguro.aseguradora,
      }));

      setOptionsSegurosVehiculares(options);
      setSeguros(segurosFiltrados); // Guardar datos de los seguros filtrados
    } catch (error) {
      console.error('Error al obtener seguros vehiculares:', error);
    }
  };


  const handleSearch = debounce((searchTerm) => {
    const filtered = vehiculos.filter((vehiculo) =>
      vehiculo.PLACA.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehiculos(filtered);
  }, 500);

  // Cambio de estado del vehículo
  const handleChangeEstado = async (vehiculo) => {
    if (!vehiculo || !vehiculo.id) {
      console.error('No se proporcionó el ID del vehículo');
      return;
    }

    const nuevoEstado = vehiculo.ESTADO === 1 ? 0 : 1;
    try {
      await axios.patch(`http://localhost:3002/api/vehiculo/${vehiculo.id}/estado`, {
        estado: nuevoEstado,
        id_usuario_modificacion: user.id,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Swal.fire('Éxito', `El vehículo ha sido ${nuevoEstado === 1 ? 'activado' : 'desactivado'}.`, 'success');
      obtenerVehiculos(); // Actualizar la lista de vehículos
    } catch (error) {
      console.error('Error al cambiar el estado del vehículo:', error);
      Swal.fire('Error', 'Hubo un problema al cambiar el estado del vehículo.', 'error');
    }
  };

  const agregarVehiculo = async () => {
    try {
      const datos = {
        placa: placa,
        n_tarjeta: nTarjeta,
        n_motor: nMotor,
        marca: marca,
        ano_de_compra: anoDeCompra,
        aseguradora: seguroId,
        n_poliza: nPoliza,
        fecha_vigencia_desde: fechaVigenciaDesde,
        fecha_vigencia_hasta: fechaVigenciaHasta,
        propietario_1_dni: propietario1Id,
        propietario_2_dni: propietario2Id,
        id_usuario: user.id,
        asociacion_nombre: asociacionId,
        color: color,
      };

      console.log('Datos a enviar:', datos);
      const response = await axios.post('http://localhost:3002/api/vehiculo', datos);
      Swal.fire('Éxito', 'Vehículo agregado con éxito.', 'success');
      obtenerVehiculos(); // Actualizar la lista de vehículos
      setShowModalAgregar(false);
      resetForm(); // Resetear el formulario
    } catch (error) {
      console.error('Error al agregar el vehículo:', error.message);
      console.error('Error al agregar el vehículo:', error.response.data);
      console.error('Error al agregar el vehículo:', error.response.status);
      console.error('Error al agregar el vehículo:', error.response.headers);
      Swal.fire('Error', 'Hubo un problema al agregar el vehículo.', 'error');
    }
  };

  const editarVehiculo = async () => {
    console.log('Se llamó a editarVehiculo');
    try {
      const datos = {
        placa: placa,
        n_tarjeta: nTarjeta,
        n_motor: nMotor,
        marca: marca,
        ano_de_compra: anoDeCompra,
        aseguradora: seguroId,
        n_poliza: nPoliza,
        fecha_vigencia_desde: new Date(fechaVigenciaDesde).toISOString().split('T')[0],
        fecha_vigencia_hasta: new Date(fechaVigenciaHasta).toISOString().split('T')[0],
        propietario_1_dni: propietario1Id,
        propietario_2_dni: propietario2Id,
        id_usuario_modificacion: user.id,
        asociacion_nombre: asociacionId,
        color: color,
      };

      console.log('Datos a enviar:', datos);
      const response = await axios.put(`http://localhost:3002/api/vehiculo/${vehiculoEditar.id}`, datos);
      Swal.fire('Éxito', 'Vehículo editado con éxito.', 'success');
      obtenerVehiculos(); // Actualizar la lista de vehículos
      setShowModalEditar(false);
    } catch (error) {
      console.error('Error al editar el vehículo:', error.message);
      console.error('Error al editar el vehículo:', error.response.data);
      console.error('Error al editar el vehículo:', error.response.status);
      console.error('Error al editar el vehículo:', error.response.headers);
    }
  };

  const handleEditarVehiculo = (vehiculo) => {
    console.log('Se llamó a handleEditarVehiculo');
    console.log('Vehículo a editar:', vehiculo);

    const fechaVigenciaDesde = moment(vehiculo.FECHA_VIGENCIA_DESDE, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const fechaVigenciaHasta = moment(vehiculo.FECHA_VIGENCIA_HASTA, 'DD/MM/YYYY').format('YYYY-MM-DD');
    setVehiculoEditar({
      id: vehiculo.ID,
      placa: vehiculo.PLACA,
      nTarjeta: vehiculo.N_TARJETA,
      nMotor: vehiculo.N_MOTOR,
      marca: vehiculo.MARCA,
      anoDeCompra: vehiculo.ANO_DE_COMPRA,
      seguroId: vehiculo.SEGURO_ID,
      nPoliza: vehiculo.N_POLIZA,
      fechaVigenciaDesde: fechaVigenciaDesde,
      fechaVigenciaHasta: fechaVigenciaHasta,
      propietario1Id: vehiculo.PROPIETARIO_1_ID,
      propietario2Id: vehiculo.PROPIETARIO_2_ID,
      asociacionId: vehiculo.ASOCIACION_ID,
      color: vehiculo.COLOR,
    });

    // Actualizar los estados de los campos del formulario
    setPlaca(vehiculo.PLACA);
    setNTarjeta(vehiculo.N_TARJETA);
    setNMotor(vehiculo.N_MOTOR);
    setMarca(vehiculo.MARCA);
    setAnoDeCompra(vehiculo.ANO_DE_COMPRA);
    setSeguroId(vehiculo.SEGURO_ID);
    setNPoliza(vehiculo.N_POLIZA);
    setFechaVigenciaDesde(fechaVigenciaDesde);
    setFechaVigenciaHasta(fechaVigenciaHasta);
    setPropietario1Id(vehiculo.PROPIETARIO_1_ID);
    setPropietario2Id(vehiculo.PROPIETARIO_2_ID);
    setAsociacionId(vehiculo.ASOCIACION_ID);
    setColor(vehiculo.COLOR);

    setShowModalEditar(true);
  };

  const resetForm = () => {
    setPlaca('');
    setNTarjeta('');
    setNMotor('');
    setMarca('');
    setAnoDeCompra('');
    setSeguroId('');
    setNPoliza('');
    setFechaVigenciaDesde('');
    setFechaVigenciaHasta('');
    setPropietario1Id('');
    setPropietario2Id('');
    setAsociacionId('');
    setColor('');
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center mb-4">Vehículos</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="primary"
          onClick={() => {
            setShowModalAgregar(true);
            resetForm();
          }}
        >
          Agregar Vehículo
        </Button>
        <Form.Control
          type="text"
          placeholder="Buscar por Placa"
          className="w-50"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => setShowInactive(!showInactive)}
        >
          {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
        </Button>
      </div>

      {
        error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )
      }
      <div className="table-responsive" style={{ maxHeight: '83%', overflowY: 'scroll' }}>
        <Table >
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Aseguradora</th>
              <th>Seguro</th>
              <th>Asociación</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehiculos.length > 0 ? (
              filteredVehiculos.map((vehiculo) => (
                <tr key={vehiculo.ID}>
                  <td>{vehiculo.ID}</td>
                  <td>{vehiculo.PLACA}</td>
                  <td>{vehiculo.MARCA}</td>
                  <td>{vehiculo.SEGURO_NOMBRE || "Sin Seguro"}</td>
                  <td>
                    {new Date(vehiculo.FECHA_VIGENCIA_HASTA.split('/').reverse().join('-')) >= new Date() ? (
                      <span className="badge bg-curso">En curso</span>
                    ) : (
                      <span className="badge bg-vencido">Vencido</span>
                    )}
                  </td>
                  <td>{vehiculo.ASOCIACION_NOMBRE || "Sin Asociación"}</td>
                  <td>
                    <span className={`badge ${vehiculo.ESTADO === 1 ? 'bg-success' : 'bg-danger'}`}>
                      {vehiculo.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column align-items-center">
                      <div className="d-flex justify-content-center mb-1">
                        <Button variant="info" className="icon-button icon-ver me-3" onClick={() => handleVerVehiculo(vehiculo)}>
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button className="icon-button icon-edit" onClick={() => handleEditarVehiculo(vehiculo)}>
                          <FaEdit />
                        </Button>
                      </div>
                      <Button
                        variant={vehiculo.ESTADO === 1 ? 'danger' : 'success'}
                        className="ms-2"
                        onClick={() => handleChangeEstado({ id: vehiculo.ID, ESTADO: vehiculo.ESTADO })}
                      >
                        {vehiculo.ESTADO === 1 ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No hay vehículos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal show={showModalAgregar} onHide={() => setShowModalAgregar(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Table>
              <tbody>
                <tr>
                  <td>
                    <Form.Group controlId="placa">
                      <Form.Label>Placa</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese la placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="n_tarjeta">
                      <Form.Label>N° Tarjeta</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el N° de tarjeta" value={nTarjeta} onChange={(e) => setNTarjeta(e.target.value)} />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="marca">
                      <Form.Label>Marca</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese la marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="n_motor">
                      <Form.Label>N° Motor</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el N° de motor" value={nMotor} onChange={(e) => setNMotor(e.target.value)} />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="ano_de_compra">
                      <Form.Label>Año de Compra</Form.Label>
                      <Form.Control type="number" placeholder="Ingrese el año de compra" value={anoDeCompra} onChange={(e) => setAnoDeCompra(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="color">
                      <Form.Label>Color</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="seguro_id">
                      <Form.Label>Aseguradora</Form.Label>
                      <Form.Select value={seguroId} onChange={(e) => setSeguroId(e.target.value)}>
                        <option value="">Seleccione una aseguradora</option>
                        {optionsSegurosVehiculares.map((seguro) => (
                          <option key={seguro.value} value={seguro.value}>
                            {seguro.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="asociacion_id">
                      <Form.Label>Asociación</Form.Label>
                      <Form.Select value={asociacionId} onChange={(e) => setAsociacionId(e.target.value)}>
                        <option value="">Seleccione una asociación</option>
                        {optionsAsociaciones.map((asociacion) => (
                          <option key={asociacion.value} value={asociacion.value}>
                            {asociacion.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="n_poliza">
                      <Form.Label>N° Póliza</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el N° de póliza" value={nPoliza} onChange={(e) => setNPoliza(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="propietario_1_id">
                      <Form.Label>Propietario 1</Form.Label>
                      <Form.Select value={propietario1Id} onChange={(e) => setPropietario1Id(e.target.value)}>
                        <option value="">Seleccione un DNI</option>
                        {optionsPropietarios.map((propietario) => (
                          <option key={propietario.value} value={propietario.value}>
                            {propietario.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="fecha_vigencia_desde">
                      <Form.Label>Fecha Vigencia Desde</Form.Label>
                      <Form.Control type="date" value={fechaVigenciaDesde} onChange={(e) => setFechaVigenciaDesde(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="propietario_2_id">
                      <Form.Label>Propietario 2</Form.Label>
                      <Form.Select value={propietario2Id} onChange={(e) => setPropietario2Id(e.target.value)}>
                        <option value="">Seleccione un DNI</option>
                        {optionsPropietarios.map((propietario) => (
                          <option key={propietario.value} value={propietario.value}>
                            {propietario.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="fecha_vigencia_hasta">
                      <Form.Label>Fecha Vigencia Hasta</Form.Label>
                      <Form.Control type="date" value={fechaVigenciaHasta} onChange={(e) => setFechaVigenciaHasta(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAgregar(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={agregarVehiculo}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalVer} onHide={() => setShowModalVer(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Información Adicional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="n_tarjeta">
                <Form.Label>N° Tarjeta</Form.Label>
                <Form.Control type="text" value={vehiculoVer.N_TARJETA} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="n_motor">
                <Form.Label>N° Motor</Form.Label>
                <Form.Control type="text" value={vehiculoVer.N_MOTOR} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="ano_de_compra">
                <Form.Label>Año de Compra</Form.Label>
                <Form.Control type="number" value={vehiculoVer.ANO_DE_COMPRA} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="n_poliza">
                <Form.Label>N° Póliza</Form.Label>
                <Form.Control type="text" value={vehiculoVer.N_POLIZA} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="fecha_vigencia_desde">
                <Form.Label>Fecha Vigencia Desde</Form.Label>
                <Form.Control type="text" value={vehiculoVer.FECHA_VIGENCIA_DESDE} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="fecha_vigencia_hasta">
                <Form.Label>Fecha Vigencia Hasta</Form.Label>
                <Form.Control type="text" value={vehiculoVer.FECHA_VIGENCIA_HASTA} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="propietario_1_id">
                <Form.Label>Propietario 1</Form.Label>
                <Form.Control type="text" value={vehiculoVer.PROPIETARIO_1_DNI} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="propietario_2_id">
                <Form.Label>Propietario 2</Form.Label>
                <Form.Control type="text" value={vehiculoVer.PROPIETARIO_2_DNI} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="color">
            <Form.Label>Color</Form.Label>
            <Form.Control type="text" value={vehiculoVer.COLOR} readOnly />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalVer(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Table>
              <tbody>
                <tr>
                  <td>
                    <Form.Group controlId="placa">
                      <Form.Label>Placa</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese la placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="n_tarjeta">
                      <Form.Label>N° Tarjeta</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el N° de tarjeta" value={nTarjeta} onChange={(e) => setNTarjeta(e.target.value)} />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="marca">
                      <Form.Label>Marca</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese la marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="n_motor">
                      <Form.Label>N° Motor</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el N° de motor" value={nMotor} onChange={(e) => setNMotor(e.target.value)} />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="ano_de_compra">
                      <Form.Label>Año de Compra</Form.Label>
                      <Form.Control type="number" placeholder="Ingrese el año de compra" value={anoDeCompra} onChange={(e) => setAnoDeCompra(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="color">
                      <Form.Label>Color</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="seguro_id">
                      <Form.Label>Aseguradora</Form.Label>
                      <Form.Select value={seguroId} onChange={(e) => setSeguroId(e.target.value)}>
                        <option value="">Seleccione una aseguradora</option>
                        {optionsSegurosVehiculares.map((seguro) => (
                          <option key={seguro.value} value={seguro.value}>
                            {seguro.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="asociacion_id">
                      <Form.Label>Asociación Perteneciente</Form.Label>
                      <Form.Select value={asociacionId} onChange={(e) => setAsociacionId(e.target.value)}>
                        <option value="">Seleccione una asociación</option>
                        {optionsAsociaciones.map((asociacion) => (
                          <option key={asociacion.value} value={asociacion.value}>
                            {asociacion.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="n_poliza">
                      <Form.Label>N° Póliza</Form.Label>
                      <Form.Control type="text" placeholder="Ingrese el N° de póliza" value={nPoliza} onChange={(e) => setNPoliza(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="propietario_1_id">
                      <Form.Label>Propietario 1</Form.Label>
                      <Form.Select value={propietario1Id} onChange={(e) => setPropietario1Id(e.target.value)}>
                        <option value="">Seleccione un DNI</option>
                        {optionsPropietarios.map((propietario) => (
                          <option key={propietario.value} value={propietario.value}>
                            {propietario.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="fecha_vigencia_desde">
                      <Form.Label>Fecha Vigencia Desde</Form.Label>
                      <Form.Control type="date" value={fechaVigenciaDesde} onChange={(e) => setFechaVigenciaDesde(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group controlId="propietario_2_id">
                      <Form.Label>Propietario 2</Form.Label>
                      <Form.Select value={propietario2Id} onChange={(e) => setPropietario2Id(e.target.value)}>
                        <option value="">Seleccione un DNI</option>
                        {optionsPropietarios.map((propietario) => (
                          <option key={propietario.value} value={propietario.value}>
                            {propietario.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Group controlId="fecha_vigencia_hasta">
                      <Form.Label>Fecha Vigencia Hasta</Form.Label>
                      <Form.Control type="date" value={fechaVigenciaHasta} onChange={(e) => setFechaVigenciaHasta(e.target.value)} />
                    </Form.Group>
                  </td>
                  <td>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalEditar(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editarVehiculo}>
            Editar
          </Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};
export default Vehiculos;