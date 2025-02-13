import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    cedula: '',
    contacto: '',
    fecha_pago_inicio: '',
    fecha_pago_final: '',
    valor_pago: '',
    descripcion: '',
    estado: '',
    fecha_ultimo_pago: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [cedulaEditando, setCedulaEditando] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (authenticated) obtenerClientes();
  }, [authenticated]);

  const handleAuth = () => {
    if (password === '123') {
      setAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const obtenerClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/clientes');
      setClientes(response.data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === 'fecha_pago_inicio') {
      updatedForm.fecha_ultimo_pago = value;
    }

    if (updatedForm.fecha_pago_final && new Date(updatedForm.fecha_pago_final) < new Date()) {
      updatedForm.estado = 'Vencido';
    } else {
      updatedForm.estado = 'Al día';
    }

    setForm(updatedForm);
  };

  const agregarCliente = async () => {
    try {
      await axios.post('http://localhost:3001/clientes', form);
      obtenerClientes();
      limpiarFormulario();
    } catch (err) {
        if (err.response && err.response.status === 400) {
            alert(err.response.data.error);
        } else {
            console.error('Error al agregar cliente', err);
        }
    }
  };

  const editarCliente = (cliente) => {
    setForm(cliente);
    setEditMode(true);
    setCedulaEditando(cliente.cedula);
  };

  const actualizarCliente = async () => {
    try {
      await axios.put(`http://localhost:3001/clientes/${cedulaEditando}`, form);
      obtenerClientes();
      limpiarFormulario();
      setEditMode(false);
      setCedulaEditando(null);
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
    }
  };

  const eliminarCliente = async (cedula) => {
    try {
      await axios.delete(`http://localhost:3001/clientes/${cedula}`);
      obtenerClientes();
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      cedula: '',
      contacto: '',
      fecha_pago_inicio: '',
      fecha_pago_final: '',
      valor_pago: '',
      descripcion: '',
      estado: 'Al día',
      fecha_ultimo_pago: ''
    });
  };

  if (!authenticated) {
    return (
      <div>
        <div>
          <h1>Acceso al Panel Administrativo</h1>
          <input
            type="password"
            placeholder="Ingrese la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAuth}>Ingresar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px'}}>
      <h1>Panel Administrativo</h1>

      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input type="text" name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} disabled={editMode} />
        <input type="text" name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        <input type="date" name="fecha_pago_inicio" value={form.fecha_pago_inicio} onChange={handleChange} />
        <input type="date" name="fecha_pago_final" value={form.fecha_pago_final} onChange={handleChange} />
        <input type="number" name="valor_pago" placeholder="Valor de Pago" value={form.valor_pago} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange}></textarea>
        <input type="date" name="fecha_ultimo_pago" value={form.fecha_ultimo_pago} onChange={handleChange} readOnly />

        {editMode ? (
          <button type="button" onClick={actualizarCliente}>Actualizar Cliente</button>
        ) : (
          <button type="button" onClick={agregarCliente}>Agregar Cliente</button>
        )}
      </form>

      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.cedula}>
            {cliente.nombre} - {cliente.cedula} - {cliente.estado} - {cliente.fecha_pago_inicio} - {cliente.valor_pago} - {cliente.descripcion}
            <button onClick={() => editarCliente(cliente)}>Editar</button>
            <button onClick={() => eliminarCliente(cliente.cedula)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
