/* eslint-disable no-unused-vars */
import axios from 'axios';
import Swal from 'sweetalert2';

export const obtenerAsociaciones = async (setAsociaciones, setFilteredAsociaciones, setError) => {
  try {
    const response = await axios.get('http://localhost:3002/api/asociaciones');
    setAsociaciones(response.data);
    setFilteredAsociaciones(response.data);
  } catch (error) {
    setError('Error al obtener asociaciones');
    Swal.fire('Error', 'Error al obtener asociaciones', 'error');
  }
};

export const handleChangeEstado = async (asociacion, user, obtenerAsociaciones, setAsociaciones, setFilteredAsociaciones, setError) => {
  const nuevoEstado = asociacion.estado === 1 ? 0 : 1;
  try {
    await axios.patch(`http://localhost:3002/api/asociaciones/${asociacion.id}/estado`, {
      estado: nuevoEstado,
      id_usuario_modificacion: user.id,
    });
    obtenerAsociaciones(setAsociaciones, setFilteredAsociaciones, setError); // Pasar los parámetros necesarios
    Swal.fire('Éxito', 'Estado de la asociación actualizado', 'success');
  } catch (error) {
    Swal.fire('Error', 'Error al cambiar el estado de la asociación', 'error');
  }
};

export const handleSubmit = async (event, editId, nombre, user,
  obtenerAsociaciones, resetForm, setShowModal, setNombre,
  setEditId) => {
  event.preventDefault();

  if (!user || !user.id) {
    Swal.fire('Error', 'Usuario no autenticado o ID no disponible', 'error');
    return;
  }

  try {
    if (editId) {
      const data = JSON.stringify({
        nombre,
        id_usuario_modificacion: user.id,
      });
      await axios.put(`http://localhost:3002/api/asociaciones/${editId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Swal.fire('Éxito', 'Asociación actualizada exitosamente', 'success');
    } else {
      const data = JSON.stringify({
        nombre,
        id_usuario: user.id,
      });
      await axios.post('http://localhost:3002/api/asociaciones', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Swal.fire('Éxito', 'Asociación agregada exitosamente', 'success');
    }
    obtenerAsociaciones();
    resetForm();
    setShowModal(false);
    setNombre('');
    setEditId(null);
  } catch (error) {
    console.error('Error al enviar el formulario:', error.message);
    Swal.fire('Error', 'Error al agregar o actualizar la asociación', 'error');
  }
};
