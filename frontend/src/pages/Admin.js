import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Admin = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
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

  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(clientes);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Clientes");
  
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
  
    saveAs(blob, "Clientes.xlsx");
  };

  /* 
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.cedula.includes(filtro)
  );
  */
  

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
      <div className='flex justify-center items-center max-h-screen w-full mt-40'>
        
          {/*contendor de la tarjeta */}
        <div className='bg-black/70 p-8 rounded-lg shadow-lg w-full max-w-lg border-2 border-red-500'>
          <h1 className='text-white text-3xl font-semibold text-center mb-6'>Acceso al Panel Administrativo</h1>
          
            {/*campo de busqueda */}
          <div className='mb-4'>
            <input
              type="password"
              placeholder="Ingrese la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 border bg-gray-300 text-black border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700'
            />
          </div>
            <button onClick={handleAuth} className="w-1/2 mx-auto block p-2 bg-red-500/80 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200">Ingresar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center max-h-screen w-full overflow-hidden">
        
        <div className="grid grid-cols-2 gap-5 w-full max-w-6xl">
            {/* Contenedor del Panel Administrativo */}
            <div className="bg-black/60 p-6 rounded-lg shadow-lg border-2 border-red-500 max-h-screen">
                <h1 className="text-2xl font-semibold text-center text-white mb-4">Panel Administrativo</h1>

                {/* Formulario */}
                <form className="flex w-full mx-auto block  flex-col space-y-3">
                    <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} 
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg focus:ring-2 focus:ring-gray-700" />

                    <input type="text" name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} disabled={editMode}
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg focus:ring-2 focus:ring-gray-700" />

                    <input type="text" name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} 
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg focus:ring-2 focus:ring-gray-700" />

                    <input type="date" name="fecha_pago_inicio" value={form.fecha_pago_inicio} onChange={handleChange}
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg" />

                    <input type="date" name="fecha_pago_final" value={form.fecha_pago_final} onChange={handleChange}
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg" />

                    <input type="number" name="valor_pago" placeholder="Valor de Pago" value={form.valor_pago} onChange={handleChange}
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg" />

                    <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange}
                              className="p-2 bg-gray-300 text-black border border-black rounded-lg"></textarea>

                    <input type="date" name="fecha_ultimo_pago" value={form.fecha_ultimo_pago} onChange={handleChange} readOnly
                           className="p-2 bg-gray-300 text-black border border-black rounded-lg" />

                    {/* Botón */}
                    {editMode ? (
                        <button type="button" onClick={actualizarCliente} 
                                className="p-2 bg-blue-500/80 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
                            Actualizar Cliente
                        </button>
                    ) : (
                        <button type="button" onClick={agregarCliente} 
                                className="p-2 bg-green-500/80 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200">
                            Agregar Cliente
                        </button>
                    )}
                </form>
            </div>

            {/* Contenedor de Lista de Clientes */}
            <div className="bg-black/60 p-6 rounded-lg shadow-lg border-2 border-red-500 min-h-[550px] flex flex-col">
                <h2 className="text-2xl text-white font-semibold text-center mb-4">Lista de Clientes</h2>

                {/* Campo de Búsqueda */}
                <input type="text" placeholder="Buscar por Cédula" onChange={(e) => setFiltro(e.target.value)} 
                       className="p-2 mb-3 bg-gray-300 text-black border border-black rounded-lg focus:ring-2 focus:ring-gray-700" />

                {/* Lista con Scroll */}
                <div className="overflow-y-auto flex-grow max-h-[375px] space-y-2 pr-2">
                    {clientes.filter(cliente => cliente.cedula.includes(filtro)).map((cliente) => (
                        <div key={cliente.cedula} className="p-3 bg-gray-300/80 rounded-lg flex justify-between items-center">
                            <div>
                                <p><strong>{cliente.nombre}</strong> - {cliente.cedula}</p>
                                <p className="text-sm">Estado: {cliente.estado} | Pago: {cliente.fecha_pago_inicio} | Valor: {cliente.valor_pago}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => editarCliente(cliente)} 
                                        className="p-2 bg-yellow-500/80 text-white rounded-lg hover:bg-yellow-600">
                                    Editar
                                </button>
                                <button onClick={() => eliminarCliente(cliente.cedula)} 
                                        className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                  onClick={exportarExcel}
                  className="p-2 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                  Exportar a Excel
                </button>
            </div>
        </div>
    </div>
  );
};

export default Admin;
