/* eslint-disable no-unused-vars */
import axios from 'axios';
import Swal from 'sweetalert2';

export const obtenerPropietarios = async (setPropietarios, setFilteredPropietarios, setError) => {
    try {
        const response = await axios.get('http://localhost:3002/api/propietarios');
        setPropietarios(response.data);
        setFilteredPropietarios(response.data);
    } catch (error) {
        setError('Error al obtener datos de Propietarios');
        Swal.fire('Error', 'Error al obtener datos de Propietarios', 'error');
    }
};

export const handleChangeEstado = async (propietario, user, obtenerPropietarios, setPropietarios, setFilteredPropietarios, setError) => {
    const nuevoEstado = propietario.estado === 1 ? 0 : 1;
    try {
        await axios.patch(`http://localhost:3002/api/propietarios/${propietario.id}/estado`, {
            estado: nuevoEstado,
            id_usuario_modificacion: user.id,
        });
        obtenerPropietarios(setPropietarios, setFilteredPropietarios, setError);
        Swal.fire('Éxito', 'Estado del propietario actualizado', 'success');
    } catch (error) {
        Swal.fire('Error', 'Error al cambiar el estado del propietario', 'error');
    }
};

export const handleSubmit = async (
    event, editId, nombre, apellido, dni, telefono,
    domicilio, user, obtenerPropietarios, propietarios,
    resetForm, setShowModal, setNombre, setApellido, setDni,
    setTelefono, setDomicilio, setEditId, filteredPropietarios,
    setPropietarios, setFilteredPropietarios, setError
) => {
    event.preventDefault();

    // Verificar si el usuario está autenticado
    if (!user || !user.id) {
        Swal.fire('Error', 'Usuario no autenticado o ID no disponible', 'error');
        return;
    }

    // Verificar si todos los campos están llenos
    if (!nombre || !apellido || !dni) {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
        return;
    }

    try {
        // Verificar si el DNI ya existe (solo para nuevos propietarios)
        if (!editId) {
            const existingPropietario = filteredPropietarios?.find((propietario) => propietario.dni === parseInt(dni));
            if (existingPropietario) {
                Swal.fire('Error', 'El DNI ya existe en otro propietario', 'error');
                return;
            }
        }

        let response;

        // Verificar si estamos editando o agregando un nuevo propietario
        if (editId) {
            const data = {
                nombre,
                apellido,
                dni,
                telefono,
                domicilio,
                id_usuario_modificacion: user.id,
            };
            response = await axios.put(`http://localhost:3002/api/propietarios/${editId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                Swal.fire('Éxito', 'Propietario actualizado exitosamente', 'success');
            }
        } else {
            const data = {
                nombre,
                apellido,
                dni,
                telefono,
                domicilio,
                id_usuario: user.id,
            };
            response = await axios.post('http://localhost:3002/api/propietarios', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201 || response.status === 200) {
                Swal.fire('Éxito', 'Propietario agregado exitosamente', 'success');
            }
        }

        // Actualizamos la lista de propietarios
        obtenerPropietarios(setPropietarios, setFilteredPropietarios, setError);
        resetForm();
        setShowModal(false);
        setNombre('');
        setApellido('');
        setDni('');
        setTelefono('');
        setDomicilio('');
        setEditId(null);

    } catch (error) {
        console.error('Error al enviar el formulario:', error.response || error.message);
        Swal.fire('Error', 'Error al agregar o actualizar el propietario', 'error');
    }
};

