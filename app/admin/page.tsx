"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Envio {
  id?: string;
  code?: string;
  guia?: string;
  sender?: string;
  remitente?: string;
  recipient?: string;
  destinatario?: string;
  destination?: string;
  direccion?: string;
  packages?: number;
  bultos?: number;
  status?: string;
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

  const cargarEnvios = async () => {
    try {
      const res = await fetch("/api/access");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEnvios(data);
        else if (data.shipments) setEnvios(data.shipments);
      }
    } catch (e) {
      console.error("Error al cargar envíos:", e);
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

    const nuevoEnvio: Envio = {
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
        setMensaje("✅ Envío guardado en Neon Postgres");
        setCode(generarGuia());
        setSender("");
        setRecipient("");
        setDestination("");
        setPackages(1);
        setStatus("EN_DEPOSITO");
        cargarEnvios();
      } else {
        setEnvios([nuevoEnvio, ...envios]);
      }
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Admin */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 text-white font-black text-xl px-3 py-1.5 rounded-xl shadow-md shadow-red-600/30">
              TR
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Panel de Administración</h1>
              <p className="text-xs text-slate-400">Gestión Operativa de Transporte Ramón</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mensaje && <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">{mensaje}</span>}
            <Link href="/" className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 transition">
              Ver Web Pública
            </Link>
          </div>
        </div>

        {/* Formulario de Carga */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Cargar Nuevo Envío</h2>
          <form onSubmit={handleCrearEnvio} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">N° Guía / Código</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-red-500 font-mono font-bold focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Remitente</label>
              <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} required placeholder="Quién envía" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Destinatario</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required placeholder="Quién recibe" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Dirección / Destino</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Ej: Mar del Plata" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Cantidad Bultos</label>
              <input type="number" min="1" value={packages} onChange={(e) => setPackages(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Estado Inicial</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500">
                <option value="EN_DEPOSITO">En Depósito</option>
                <option value="EN_TRANSITO">En Tránsito</option>
                <option value="EN_REPARTO">En Reparto</option>
                <option value="ENTREGADO">Entregado</option>
              </select>
            </div>
            <div className="lg:col-span-3 pt-2">
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-600/30">
                {loading ? "Guardando..." : "Guardar Envío"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla Registros */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Envíos Registrados ({envios.length})</h2>
          {envios.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No hay envíos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50">
                    <th className="p-3.5 rounded-l-xl">Guía</th>
                    <th className="p-3.5">Remitente / Destinatario</th>
                    <th className="p-3.5">Bultos</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 rounded-r-xl">Etiqueta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {envios.map((item, idx) => {
                    const c = item.code || item.guia || "";
                    const dest = item.recipient || item.destinatario || "-";
                    const dir = item.destination || item.direccion || "";
                    const bult = item.packages || item.bultos || 1;
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-mono font-bold text-red-500">{c}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200 block">{dest}</span>
                          <span className="text-xs text-slate-500">{dir}</span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-300">{bult}</td>
                        <td className="p-3.5">
                          <select
                            value={item.status || "EN_DEPOSITO"}
                            onChange={(e) => handleCambiarEstado(c, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="EN_DEPOSITO">En Depósito</option>
                            <option value="EN_TRANSITO">En Tránsito</option>
                            <option value="EN_REPARTO">En Reparto</option>
                            <option value="ENTREGADO">Entregado</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <a
                            href={`/api/label/${c}`}
                            target="_blank"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition inline-block"
                          >
                            📄 PDF
                          </a>
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
