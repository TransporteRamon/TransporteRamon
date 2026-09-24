"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Envio {
  code: string;
  sender: string;
  recipient: string;
  destination: string;
  packages: number;
  status: string;
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

  // Cargar envíos desde API y LocalStorage
  const cargarEnvios = async () => {
    let listaLocal: Envio[] = [];
    const local = localStorage.getItem("tr_shipments_db");
    if (local) {
      try { listaLocal = JSON.parse(local); } catch (e) {}
    }

    try {
      const res = await fetch("/api/access");
      if (res.ok) {
        const data = await res.json();
        const apiList = Array.isArray(data) ? data : data.shipments || [];
        if (apiList.length > 0) {
          setEnvios(apiList);
          localStorage.setItem("tr_shipments_db", JSON.stringify(apiList));
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setEnvios(listaLocal);
  };

  useEffect(() => {
    setCode(generarGuia());
    cargarEnvios();
  }, []);

  const guardarLista = (lista: Envio[]) => {
    setEnvios(lista);
    localStorage.setItem("tr_shipments_db", JSON.stringify(lista));
  };

  const handleCrearEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !recipient) return;
    setLoading(true);

    const nuevoEnvio: Envio = {
      code,
      sender: sender || "Transporte Ramón",
      recipient,
      destination: destination || "Mar del Plata",
      packages: Number(packages) || 1,
      status,
      createdAt: new Date().toISOString(),
    };

    // Intentar guardar en la API / Neon
    try {
      await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEnvio),
      });
    } catch (e) {
      console.error(e);
    }

    // Guardado persistente garantizado
    const nuevaLista = [nuevoEnvio, ...envios.filter(item => item.code !== code)];
    guardarLista(nuevaLista);

    setMensaje("✅ Envío guardado exitosamente");
    setCode(generarGuia());
    setSender("");
    setRecipient("");
    setDestination("");
    setPackages(1);
    setStatus("EN_DEPOSITO");
    setLoading(false);

    setTimeout(() => setMensaje(""), 4000);
  };

  const handleCambiarEstado = async (shipmentCode: string, nuevoEstado: string) => {
    const actualizada = envios.map((item) =>
      item.code === shipmentCode ? { ...item, status: nuevoEstado } : item
    );
    guardarLista(actualizada);

    try {
      await fetch("/api/access", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: shipmentCode, status: nuevoEstado }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 text-white font-black text-2xl px-3.5 py-1 rounded-2xl shadow-lg shadow-red-600/30">
              TR
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Panel de Control Operativo</h1>
              <p className="text-xs text-slate-400">Transporte Ramón - Mar del Plata</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mensaje && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">{mensaje}</span>}
            <Link href="/" className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition">
              Ver Sitio Público
            </Link>
          </div>
        </div>

        {/* Formulario Alta */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Cargar Nuevo Envío</h2>
          <form onSubmit={handleCrearEnvio} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">N° Guía / Código</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-red-500 font-mono font-bold focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Remitente (Envía)</label>
              <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Ej: Distribuidora SRL" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Destinatario (Recibe)</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required placeholder="Ej: Juan Pérez" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Dirección / Destino</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ej: Av. Libertad 5943, MDQ" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cantidad de Bultos</label>
              <input type="number" min="1" value={packages} onChange={(e) => setPackages(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Estado Inicial</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500">
                <option value="EN_DEPOSITO">En Depósito</option>
                <option value="EN_TRANSITO">En Tránsito</option>
                <option value="EN_REPARTO">En Reparto</option>
                <option value="ENTREGADO">Entregado</option>
              </select>
            </div>
            <div className="lg:col-span-3 pt-2">
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-red-600/30">
                {loading ? "Guardando..." : "💾 Guardar Envío"}
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
                    <th className="p-3.5">Código Guía</th>
                    <th className="p-3.5">Destinatario / Destino</th>
                    <th className="p-3.5">Bultos</th>
                    <th className="p-3.5">Cambiar Estado</th>
                    <th className="p-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {envios.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono font-bold text-red-500">{item.code}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block">{item.recipient}</span>
                        <span className="text-xs text-slate-500">{item.destination}</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-300">{item.packages}</td>
                      <td className="p-3.5">
                        <select
                          value={item.status}
                          onChange={(e) => handleCambiarEstado(item.code, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="EN_DEPOSITO">En Depósito</option>
                          <option value="EN_TRANSITO">En Tránsito</option>
                          <option value="EN_REPARTO">En Reparto</option>
                          <option value="ENTREGADO">Entregado</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-center">
                        <a
                          href={`/api/label/${item.code}?sender=${encodeURIComponent(item.sender)}&recipient=${encodeURIComponent(item.recipient)}&destination=${encodeURIComponent(item.destination)}&packages=${item.packages}`}
                          target="_blank"
                          className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 transition inline-flex items-center gap-1"
                        >
                          📄 Imprimir Etiqueta
                        </a>
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
