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
        <div className="flex justify-center items-center h-screen h-screen w-full overflow-hidden">
            {/* Contenedor de la tarjeta */}
            <div className="bg-black/60 p-8 rounded-lg shadow-lg w-full max-w-lg border-2 border-red-500">
                <h1 className="text-3xl font-semibold text-center text-white mb-6">Consulta de Clientes</h1>

                {/* Campo de búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Ingrese la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        className="w-full p-3 border bg-gray-300 text-black border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                    />
                </div>

                {/* Botón de búsqueda */}
                <button
                    onClick={buscarCliente}
                    className="w-full p-3 bg-red-500/80 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Buscar
                </button>

                {/* Mensaje de error */}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {/* Información del cliente */}
                {cliente && (
                    <div className="mt-6 text-white">
                        <h2 className="text-2xl text-white font-semibold text-center mb-4">Información del Cliente</h2>
                        <p><strong>Nombre:</strong> {cliente.nombre}</p>
                        <p><strong>Contacto:</strong> {cliente.contacto}</p>
                        <p><strong>Fecha de Pago:</strong> {cliente.fecha_pago_inicio} - {cliente.fecha_pago_final}</p>
                        <p><strong>Último Pago:</strong> {cliente.fecha_ultimo_pago}</p>
                        <p><strong>Valor de Pago:</strong> {cliente.valor_pago}</p>
                        <p><strong>Estado:</strong> {cliente.estado}</p>
                        {cliente.descripcion && <p><strong>Descripción:</strong> {cliente.descripcion}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
