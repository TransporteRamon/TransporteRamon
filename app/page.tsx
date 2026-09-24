"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [tab, setTab] = useState<"seguimiento" | "contacto">("seguimiento");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [resultadoEnvio, setResultadoEnvio] = useState<any>(null);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoBusqueda.trim()) return;
    setBuscado(true);

    const code = codigoBusqueda.trim().toUpperCase();
    const guardados = localStorage.getItem("tr_shipments_db");
    
    if (guardados) {
      try {
        const lista = JSON.parse(guardados);
        const encontrado = lista.find((item: any) => item.code.toUpperCase() === code);
        if (encontrado) {
          setResultadoEnvio(encontrado);
          return;
        }
      } catch (e) {}
    }

    setResultadoEnvio(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 text-white font-black text-2xl px-3.5 py-1 rounded-2xl shadow-lg shadow-red-600/30">
              TR
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">TRANSPORTE RAMÓN</h1>
              <p className="text-xs text-red-500 font-medium">Logística & Distribución</p>
            </div>
          </div>

          <nav className="flex space-x-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setTab("seguimiento")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === "seguimiento" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              📦 Rastrear Envío
            </button>
            <button
              onClick={() => setTab("contacto")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === "contacto" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              📞 Contacto
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {tab === "seguimiento" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
                Seguimiento Oficial
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                ¿Dónde está tu paquete?
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Ingresá el número de guía asignado (ej: TR-872440) para consultar el estado en tiempo real.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-2xl">
              <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Número de Guía (ej: TR-872440)"
                  value={codigoBusqueda}
                  onChange={(e) => setCodigoBusqueda(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-mono font-bold uppercase focus:outline-none focus:border-red-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg shadow-red-600/30"
                >
                  Rastrear Paquete
                </button>
              </form>
            </div>

            {resultadoEnvio && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase">Guía N°</span>
                    <p className="text-3xl font-black font-mono text-red-500">{resultadoEnvio.code}</p>
                  </div>
                  <span className="px-4 py-2 rounded-2xl text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ● {resultadoEnvio.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 text-xs font-bold block mb-1">Remitente</span>
                    <p className="font-semibold text-slate-200">{resultadoEnvio.sender}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 text-xs font-bold block mb-1">Destinatario</span>
                    <p className="font-semibold text-slate-200">{resultadoEnvio.recipient}</p>
                    <p className="text-xs text-slate-400">{resultadoEnvio.destination}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 text-xs font-bold block mb-1">Bultos</span>
                    <p className="font-semibold text-slate-200">{resultadoEnvio.packages} Bulto(s)</p>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href={`/api/label/${resultadoEnvio.code}?sender=${encodeURIComponent(resultadoEnvio.sender)}&recipient=${encodeURIComponent(resultadoEnvio.recipient)}&destination=${encodeURIComponent(resultadoEnvio.destination)}&packages=${resultadoEnvio.packages}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-2xl transition border border-slate-700 text-xs uppercase"
                  >
                    📄 Ver / Imprimir Etiqueta PDF
                  </a>
                </div>
              </div>
            )}

            {buscado && !resultadoEnvio && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-3xl text-center text-sm font-medium">
                No se encontró ningún paquete registrado con la guía ingresada. Verificá los caracteres e intentá de nuevo.
              </div>
            )}
          </div>
        )}

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
