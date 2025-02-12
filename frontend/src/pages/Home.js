import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [cedula, setCedula] = useState('');
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState('');

    const buscarCliente = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/clientes/${cedula}`);
            if (response.data) {
                setCliente(response.data);
                setError('');
            } else {
                setCliente('');
                setError('Cliente no encontrado');
            }
        } catch (err) {
            console.error(err);
            setError('Error al buscar cliente');
        }
    };
    return (
        <div style={{ padding: '20px', backgroundColor: 'gray' }}>
          <h1>Consulta de Clientes</h1>
          <input
            type="text"
            placeholder="Ingrese la cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <button onClick={buscarCliente}>Buscar</button>
    
          {error && <p style={{ color: 'red' }}>{error}</p>}
    
          {cliente && (
            <div style={{ marginTop: '20px' }}>
              <h2>Información del Cliente</h2>
              <p><strong>Nombre:</strong> {cliente.nombre}</p>
              <p><strong>Contacto:</strong> {cliente.contacto}</p>
              <p><strong>Fecha de Pago:</strong> {cliente.fecha_pago_inicio} - {cliente.fecha_pago_final}</p>
              <p><strong>Valor de Pago:</strong> {cliente.valor_pago}</p>
              <p><strong>Estado:</strong> {cliente.estado}</p>
              <p><strong>Último Pago:</strong> {cliente.fecha_ultimo_pago}</p>
              {cliente.descripcion && <p><strong>Descripción:</strong> {cliente.descripcion}</p>}
            </div>
          )}
        </div>
      );    
};

export default Home;