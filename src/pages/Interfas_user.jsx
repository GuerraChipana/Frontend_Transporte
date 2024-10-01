/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../style/InterfasUser.css'; 

const InterfasUser = () => {
  const [placa, setPlaca] = useState('');

  const handleInputChange = (e) => {
    setPlaca(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Placa ingresada:', placa);
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Interfaz de Usuario</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="placa" className="label">
            Ingrese la placa del vehículo:
          </label>
          <input
            type="text"
            id="placa"
            value={placa}
            onChange={handleInputChange}
            placeholder="ABC-123"
            className="input"
            required
          />
          <button type="submit" className="button">Buscar Vehículo</button>
        </form>
      </div>
      <Link to="/login" className="adminLink">Administrador</Link>
    </div>
  );
};

export default InterfasUser;
