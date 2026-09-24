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

  const generarGuia = () => `TR-${Math.floor(100000 + Math.random() * 900000)}`;

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

    setGuia(generarGuia());
    setCliente("");
    setRemitente("");
    setDestinatario("");
    setDireccion("");
    setBultos(1);
    setEstado("En Depósito");
  };

  const handleCambiarEstado = (index: number, nuevoEstado: string) => {
    const copia = [...envios];
    copia[index].estado = nuevoEstado;
    setEnvios(copia);
  };

  const handleImprimirEtiqueta = (item: Envio) => {
    const ventana = window.open("", "_blank");
    if (!ventana) return;
    ventana.document.write(`
      <html>
        <head>
          <title>Etiqueta ${item.guia}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .box { border: 3px solid #000; padding: 20px; max-w: 400px; margin: auto; }
            .header { font-size: 20px; font-weight: bold; color: #dc2626; border-bottom: 2px solid #000; padding-bottom: 5px; }
            .code { font-size: 24px; font-family: monospace; font-weight: bold; text-align: center; background: #f1f5f9; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="header">TRANSPORTE RAMÓN</div>
            <div class="code">${item.guia}</div>
            <p><strong>Remitente:</strong> ${item.remitente}</p>
            <p><strong>Destinatario:</strong> ${item.destinatario}</p>
            <p><strong>Dirección:</strong> ${item.direccion}</p>
            <p><strong>Bultos:</strong> ${item.bultos}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    ventana.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-500">Gestión Operativa de Envíos</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Cargar Nuevo Envío</h2>
          <form onSubmit={handleCrearEnvio} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">N° Guía</label>
              <input type="text" value={guia} readOnly className="w-full p-2.5 border rounded-lg bg-slate-100 font-bold text-red-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cliente / Empresa</label>
              <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remitente</label>
              <input type="text" value={remitente} onChange={(e) => setRemitente(e.target.value)} className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destinatario</label>
              <input type="text" value={destinatario} onChange={(e) => setDestinatario(e.target.value)} required className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bultos</label>
              <input type="number" min="1" value={bultos} onChange={(e) => setBultos(Number(e.target.value))} required className="w-full p-2.5 border rounded-lg" />
            </div>
            <div className="md:col-span-3 pt-2">
              <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700">
                Guardar Envío
              </button>
            </div>
          </form>
        </div>

        {/* Tabla con Cambio de Estado e Impresión */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Envíos Registrados</h2>
          {envios.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No hay envíos registrados en esta sesión.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-bold text-slate-500 uppercase bg-slate-50">
                    <th className="p-3">Guía</th>
                    <th className="p-3">Cliente / Destino</th>
                    <th className="p-3">Bultos</th>
                    <th className="p-3">Cambiar Estado</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {envios.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-red-600">{item.guia}</td>
                      <td className="p-3">
                        <span className="font-semibold block">{item.destinatario}</span>
                        <span className="text-xs text-slate-500">{item.direccion}</span>
                      </td>
                      <td className="p-3 font-bold">{item.bultos}</td>
                      <td className="p-3">
                        <select
                          value={item.estado}
                          onChange={(e) => handleCambiarEstado(idx, e.target.value)}
                          className="p-1.5 border rounded-md text-xs font-bold bg-white"
                        >
                          <option value="En Depósito">En Depósito</option>
                          <option value="En Reparto">En Reparto</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleImprimirEtiqueta(item)}
                          className="bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-black"
                        >
                          🖨️ Etiqueta PDF
                        </button>
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
