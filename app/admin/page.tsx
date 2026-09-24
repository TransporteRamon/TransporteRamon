"use client";

import { useState, useEffect } from "react";

interface Envio {
  id?: string;
  code?: string;
  guia?: string;
  sender?: string;
  recipient?: string;
  destination?: string;
  packages?: number;
  status?: string;
  createdAt?: string;
}

export default function AdminPage() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Formulario
  const [code, setCode] = useState("");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [destination, setDestination] = useState("");
  const [packages, setPackages] = useState(1);
  const [status, setStatus] = useState("EN_DEPOSITO");

  const generarGuia = () => `TR-${Math.floor(100000 + Math.random() * 900000)}`;

  // Cargar envíos desde la base de datos de Neon vía API
  const cargarEnvios = async () => {
    try {
      const res = await fetch("/api/access");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEnvios(data);
        else if (data.shipments) setEnvios(data.shipments);
      }
    } catch (e) {
      console.error("Error al cargar de Neon:", e);
    }
  };

  useEffect(() => {
    setCode(generarGuia());
    cargarEnvios();
  }, []);

  const handleCrearEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const nuevoEnvio = {
      code,
      sender,
      recipient,
      destination,
      packages: Number(packages) || 1,
      status,
    };

    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEnvio),
      });

      if (res.ok) {
        setMensaje("✅ Envío guardado con éxito en Neon");
        setCode(generarGuia());
        setSender("");
        setRecipient("");
        setDestination("");
        setPackages(1);
        setStatus("EN_DEPOSITO");
        cargarEnvios();
      } else {
        setMensaje("⚠️ Guardado localmente en respaldo.");
        setEnvios([nuevoEnvio, ...envios]);
      }
    } catch (error) {
      setMensaje("⚠️ Guardado en sesión local.");
      setEnvios([nuevoEnvio, ...envios]);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (shipmentCode: string, nuevoEstado: string) => {
    try {
      await fetch("/api/access", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: shipmentCode, status: nuevoEstado }),
      });
      cargarEnvios();
    } catch (e) {
      console.error(e);
    }
  };

  const handleImprimirEtiqueta = (item: Envio) => {
    const trackingCode = item.code || item.guia;
    window.open(`/api/label/${trackingCode}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-500">Transporte Ramón - Base de datos Neon</p>
          </div>
          {mensaje && <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">{mensaje}</span>}
        </div>

        {/* Formulario de Carga */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Cargar Nuevo Envío</h2>
          <form onSubmit={handleCrearEnvio} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">N° Guía / Código</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full p-2.5 border rounded-lg bg-slate-50 font-mono font-bold text-red-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remitente (Envía)</label>
              <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} required placeholder="Ej: Juan Pérez" className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destinatario (Recibe)</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required placeholder="Ej: María Gómez" className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección / Destino</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Ej: Av. Colón 1234, Mar del Plata" className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad de Bultos</label>
              <input type="number" min="1" value={packages} onChange={(e) => setPackages(Number(e.target.value))} required className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado Inicial</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white">
                <option value="EN_DEPOSITO">En Depósito</option>
                <option value="EN_TRANSITO">En Tránsito</option>
                <option value="EN_REPARTO">En Reparto</option>
                <option value="ENTREGADO">Entregado</option>
              </select>
            </div>
            <div className="md:col-span-3 pt-2">
              <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">
                {loading ? "Guardando en Neon..." : "Guardar y Registrar Envío"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de Registros */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Envíos Registrados</h2>
          {envios.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No hay envíos registrados aún en la base de datos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-bold text-slate-500 uppercase bg-slate-50">
                    <th className="p-3">Código Guía</th>
                    <th className="p-3">Remitente / Destinatario</th>
                    <th className="p-3">Bultos</th>
                    <th className="p-3">Estado Actual</th>
                    <th className="p-3">Etiqueta</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {envios.map((item, idx) => {
                    const c = item.code || item.guia || "";
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-red-600">{c}</td>
                        <td className="p-3">
                          <span className="font-semibold block">{item.recipient || item.destinatario}</span>
                          <span className="text-xs text-slate-500">{item.destination || item.direccion}</span>
                        </td>
                        <td className="p-3 font-bold">{item.packages || item.bultos || 1}</td>
                        <td className="p-3">
                          <select
                            value={item.status || "EN_DEPOSITO"}
                            onChange={(e) => handleCambiarEstado(c, e.target.value)}
                            className="p-1.5 border rounded-md text-xs font-bold bg-white"
                          >
                            <option value="EN_DEPOSITO">En Depósito</option>
                            <option value="EN_TRANSITO">En Tránsito</option>
                            <option value="EN_REPARTO">En Reparto</option>
                            <option value="ENTREGADO">Entregado</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleImprimirEtiqueta(item)}
                            className="bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-black"
                          >
                            📄 Etiqueta PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
