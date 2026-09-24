"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [tab, setTab] = useState<"seguimiento" | "etiqueta" | "contacto">("seguimiento");

  // Estado para búsqueda
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [resultadoEnvio, setResultadoEnvio] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  // Estado para auto-generar etiqueta
  const [remitente, setRemitente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [direccion, setDireccion] = useState("");
  const [bultos, setBultos] = useState(1);
  const [etiquetaGenerada, setEtiquetaGenerada] = useState<any>(null);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoBusqueda.trim()) return;
    setCargando(true);
    setBuscado(true);
    setResultadoEnvio(null);

    try {
      const code = codigoBusqueda.trim().toUpperCase();
      const res = await fetch(`/api/access?code=${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.code || data.guia)) {
          setResultadoEnvio(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  const handleGenerarEtiqueta = (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    setEtiquetaGenerada({
      codigo,
      remitente,
      destinatario,
      direccion,
      bultos
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 text-white font-black text-2xl tracking-tighter px-3 py-1 rounded-xl shadow-lg shadow-red-600/30">
              TR
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">TRANSPORTE RAMÓN</h1>
              <p className="text-xs text-red-500 font-medium">Logística & Distribución</p>
            </div>
          </div>

          <nav className="flex space-x-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setTab("seguimiento")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === "seguimiento"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              📦 Rastrear Envío
            </button>
            <button
              onClick={() => setTab("etiqueta")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === "etiqueta"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              🏷️ Crear Etiqueta
            </button>
            <button
              onClick={() => setTab("contacto")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === "contacto"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              📞 Contacto
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* PESTAÑA 1: SEGUIMIENTO */}
        {tab === "seguimiento" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Seguimiento en Tiempo Real
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ¿Dónde está tu paquete?
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Ingresá tu código de guía (Ej: TR-872440) para consultar el estado actualizado de tu despacho.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
              <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Número de Guía (ej: TR-872440)"
                  value={codigoBusqueda}
                  onChange={(e) => setCodigoBusqueda(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-500 font-mono font-bold uppercase focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
                  required
                />
                <button
                  type="submit"
                  disabled={cargando}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  {cargando ? "Buscando..." : "Buscar Guía"}
                </button>
              </form>
            </div>

            {/* Resultado Encontrado */}
            {resultadoEnvio && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Código de Guía</span>
                    <p className="text-3xl font-black font-mono text-red-500">{resultadoEnvio.code || resultadoEnvio.guia}</p>
                  </div>
                  <span className={`self-start sm:self-auto px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wide border ${
                    (resultadoEnvio.status || "").includes("ENTREGADO") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    (resultadoEnvio.status || "").includes("REPARTO") ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    ● {resultadoEnvio.status || "EN DEPOSITÓ"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-slate-500 text-xs font-medium block mb-1">Remitente</span>
                    <p className="font-semibold text-slate-200">{resultadoEnvio.sender || resultadoEnvio.remitente || "-"}</p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-slate-500 text-xs font-medium block mb-1">Destinatario</span>
                    <p className="font-semibold text-slate-200">{resultadoEnvio.recipient || resultadoEnvio.destinatario || "-"}</p>
                    <p className="text-xs text-slate-400 mt-1">{resultadoEnvio.destination || resultadoEnvio.direccion || ""}</p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-slate-500 text-xs font-medium block mb-1">Bultos</span>
                    <p className="font-semibold text-slate-200">{resultadoEnvio.packages || resultadoEnvio.bultos || 1} Bulto(s)</p>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href={`/api/label/${resultadoEnvio.code || resultadoEnvio.guia}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-2xl transition border border-slate-700 text-xs uppercase tracking-wider"
                  >
                    📄 Imprimir Etiqueta Oficial PDF
                  </a>
                </div>
              </div>
            )}

            {buscado && !resultadoEnvio && !cargando && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-3xl text-center text-sm font-medium">
                No se encontró ningún envío asociado a esa guía. Verificá los caracteres e intentá nuevamente.
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: GENERAR ETIQUETA */}
        {tab === "etiqueta" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Generar Etiqueta de Bulto</h2>
              <p className="text-slate-400 text-sm">Completá los datos para armar la etiqueta en PDF lista para pegar en la caja.</p>
            </div>

            {!etiquetaGenerada ? (
              <form onSubmit={handleGenerarEtiqueta} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Remitente (Envía)</label>
                  <input
                    type="text"
                    required
                    value={remitente}
                    onChange={(e) => setRemitente(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500"
                    placeholder="Tu nombre / Empresa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Destinatario (Recibe)</label>
                  <input
                    type="text"
                    required
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Dirección de Entrega</label>
                  <input
                    type="text"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ej: Av. Libertad 5943, Mar del Plata"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Cantidad de Bultos</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bultos}
                    onChange={(e) => setBultos(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-red-600/30"
                  >
                    Generar Etiqueta PDF
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="border-4 border-dashed border-slate-700 bg-white text-slate-900 p-6 rounded-2xl max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
                    <span className="font-black text-xl text-red-600">TRANSPORTE RAMÓN</span>
                    <span className="text-xs bg-slate-900 text-white px-2.5 py-1 font-mono font-bold rounded">EXPRESO</span>
                  </div>
                  <div className="text-center bg-slate-100 py-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase tracking-widest">Código de Guía</span>
                    <span className="text-2xl font-black font-mono tracking-widest">{etiquetaGenerada.codigo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 block">REMITENTE:</span>
                      <p className="font-semibold text-slate-900">{etiquetaGenerada.remitente}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block">DESTINATARIO:</span>
                      <p className="font-semibold text-slate-900">{etiquetaGenerada.destinatario}</p>
                      <p className="text-[11px] text-slate-600">{etiquetaGenerada.direccion}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xs font-bold text-slate-800">
                    <span>BULTOS: {etiquetaGenerada.bultos}</span>
                    <span>MAR DEL PLATA</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-red-600/30 text-xs uppercase"
                  >
                    🖨️ Imprimir
                  </button>
                  <button
                    onClick={() => setEtiquetaGenerada(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-xl transition text-xs uppercase"
                  >
                    Nueva Etiqueta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: CONTACTO */}
        {tab === "contacto" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Atención al Cliente & Depósito</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-red-500 text-base">📍 Dirección Depósito</h3>
                <p className="text-slate-200">Avenida Libertad 5943 / Malvinas 970</p>
                <p className="text-slate-400 text-xs">Mar del Plata, Buenos Aires</p>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-red-500 text-base">⏰ Horarios de Atención</h3>
                <p className="text-slate-200">Lunes a Viernes: 06:00 a 13:30 hs</p>
                <p className="text-slate-200">Sábados: 06:00 a 10:30 hs</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
