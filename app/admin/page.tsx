"use client";

import { useState, useEffect } from "react";

interface Envio {
  guia: string;
  cliente: string;
  remitente: string;
  destinatario: string;
  direccion: string;
  bultos: number;
  estado: string;
}

export default function AdminPage() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  
  // Campos del formulario
  const [guia, setGuia] = useState("");
  const [cliente, setCliente] = useState("");
  const [remitente, setRemitente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [direccion, setDireccion] = useState("");
  const [bultos, setBultos] = useState<number | "">(1);
  const [estado, setEstado] = useState("En Depósito");

  // Generar número de guía automático al cargar la página
  const generarGuia = () => {
    const numero = Math.floor(100000 + Math.random() * 900000);
    return `TR-${numero}`;
  };

  useEffect(() => {
    setGuia(generarGuia());
  }, []);

  const handleCrearEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guia || !cliente || !destinatario) return;

    const nuevoEnvio: Envio = {
      guia,
      cliente,
      remitente: remitente || cliente,
      destinatario,
      direccion,
      bultos: Number(bultos) || 1,
      estado,
    };

    setEnvios([nuevoEnvio, ...envios]);

    // Limpiar formulario y asignar nuevo número de guía
    setGuia(generarGuia());
    setCliente("");
    setRemitente("");
    setDestinatario("");
    setDireccion("");
    setBultos(1);
    setEstado("En Depósito");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-500">Gestión de envíos de Transporte Ramón</p>
          </div>
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
            Modo Activo
          </span>
        </div>

        {/* Formulario de Carga */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Cargar Nuevo Envío</h2>
          <form onSubmit={handleCrearEnvio} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° de Guía (Autogenerado)
              </label>
              <input
                type="text"
                value={guia}
                onChange={(e) => setGuia(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-gray-50 font-bold text-red-600 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente / Empresa</label>
              <input
                type="text"
                placeholder="Nombre de la cuenta / empresa"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remitente</label>
              <input
                type="text"
                placeholder="Quien envía el paquete"
                value={remitente}
                onChange={(e) => setRemitente(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario</label>
              <input
                type="text"
                placeholder="Nombre de quien recibe"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección / Destino</label>
              <input
                type="text"
                placeholder="Ej: Av. Colón 1234, Mar del Plata"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Bultos</label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={bultos}
                onChange={(e) => setBultos(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
              >
                <option value="En Depósito">En Depósito</option>
                <option value="En Reparto">En Reparto</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition shadow-sm"
              >
                Guardar y Registrar Envío
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Envíos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Envíos Registrados</h2>
          {envios.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No hay envíos registrados aún en la sesión.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                    <th className="p-3">N° Guía</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Remitente</th>
                    <th className="p-3">Destinatario</th>
                    <th className="p-3">Bultos</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {envios.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-bold text-red-600">{item.guia}</td>
                      <td className="p-3 text-gray-800 font-medium">{item.cliente}</td>
                      <td className="p-3 text-gray-600">{item.remitente || "-"}</td>
                      <td className="p-3 text-gray-800">
                        {item.destinatario}
                        {item.direccion && <span className="block text-xs text-gray-400">{item.direccion}</span>}
                      </td>
                      <td className="p-3 font-bold text-gray-700">{item.bultos}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.estado === "Entregado" ? "bg-green-100 text-green-800" :
                          item.estado === "En Reparto" ? "bg-yellow-100 text-yellow-800" :
                          item.estado === "Cancelado" ? "bg-red-100 text-red-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {item.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
