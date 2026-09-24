"use client";

import { useState } from "react";

export default function HomePage() {
  const [tab, setTab] = useState<"seguimiento" | "etiqueta" | "contacto">("seguimiento");

  // Estado para búsqueda
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [resultadoEnvio, setResultadoEnvio] = useState<any>(null);
  const [errorBusqueda, setErrorBusqueda] = useState(false);

  // Estado para auto-generar etiqueta
  const [clienteNombre, setClienteNombre] = useState("");
  const [remitente, setRemitente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [direccion, setDireccion] = useState("");
  const [bultos, setBultos] = useState(1);
  const [etiquetaGenerada, setEtiquetaGenerada] = useState<any>(null);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBusqueda(false);
    
    // Simulación de respuesta segura para pruebas locales / integración
    if (codigoBusqueda.trim().toUpperCase().startsWith("TR-")) {
      setResultadoEnvio({
        guia: codigoBusqueda.trim().toUpperCase(),
        estado: "En Reparto",
        origen: "Mar del Plata",
        destino: "Buenos Aires",
        bultos: 2,
        fecha: new Date().toLocaleDateString("es-AR")
      });
    } else {
      setErrorBusqueda(true);
      setResultadoEnvio(null);
    }
  };

  const handleGenerarEtiqueta = (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    setEtiquetaGenerada({
      codigo,
      clienteNombre,
      remitente,
      destinatario,
      direccion,
      bultos
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-red-600">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 text-white font-black text-2xl px-3 py-1 rounded">TR</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TRANSPORTE RAMÓN</h1>
              <p className="text-xs text-slate-400">Logística & Distribución - Mar del Plata</p>
            </div>
          </div>
          <nav className="flex space-x-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setTab("seguimiento")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                tab === "seguimiento" ? "bg-red-600 text-white shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              📦 Seguimiento
            </button>
            <button
              onClick={() => setTab("etiqueta")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                tab === "etiqueta" ? "bg-red-600 text-white shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              🏷️ Generar Etiqueta PDF
            </button>
            <button
              onClick={() => setTab("contacto")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                tab === "contacto" ? "bg-red-600 text-white shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              📞 Contacto
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* TAB 1: SEGUIMIENTO */}
        {tab === "seguimiento" && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Consulta el estado de tu envío</h2>
              <p className="text-slate-500 mb-6">Ingresá el número de guía (Ej: TR-872440) para realizar el seguimiento en tiempo real.</p>
              
              <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Número de Guía (ej: TR-872440)"
                  value={codigoBusqueda}
                  onChange={(e) => setCodigoBusqueda(e.target.value)}
                  className="flex-1 p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold text-slate-800 uppercase"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-red-700 transition shadow-sm"
                >
                  Rastrear
                </button>
              </form>
            </div>

            {resultadoEnvio && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Código de Envío</span>
                    <p className="text-xl font-extrabold text-red-600">{resultadoEnvio.guia}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold">
                    {resultadoEnvio.estado}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Fecha</span>
                    <span className="font-semibold">{resultadoEnvio.fecha}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Bultos</span>
                    <span className="font-semibold">{resultadoEnvio.bultos}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Origen</span>
                    <span className="font-semibold">{resultadoEnvio.origen}</span>
                  </div>
                </div>
              </div>
            )}

            {errorBusqueda && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center font-medium">
                No se encontró ningún envío registrado con el código ingresado. Verificá los datos e intentá de nuevo.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GENERAR ETIQUETA */}
        {tab === "etiqueta" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Generar Etiqueta para Caja / Paquete</h2>
              <p className="text-slate-500 text-sm">Completá los datos de tu despacho para generar la etiqueta con código e imprimirla directamente.</p>
            </div>

            {!etiquetaGenerada ? (
              <form onSubmit={handleGenerarEtiqueta} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tu Nombre / Empresa</label>
                  <input
                    type="text"
                    required
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Ej: Distribuidora SRL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Remitente</label>
                  <input
                    type="text"
                    required
                    value={remitente}
                    onChange={(e) => setRemitente(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Nombre de quien despacha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destinatario</label>
                  <input
                    type="text"
                    required
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Nombre del cliente destino"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Ej: Av. Libertad 5943, Mar del Plata"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Cantidad de Bultos</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bultos}
                    onChange={(e) => setBultos(Number(e.target.value))}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition"
                  >
                    Generar Etiqueta Imprimible
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* VISTA PREVIA ETIQUETA IMPRIMIBLE */}
                <div id="etiqueta-print" className="border-4 border-dashed border-slate-900 p-6 rounded-xl bg-white space-y-4 max-w-lg mx-auto">
                  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
                    <span className="font-black text-xl text-red-600">TRANSPORTE RAMÓN</span>
                    <span className="text-xs bg-black text-white px-2 py-1 font-mono font-bold">EXPRESO</span>
                  </div>
                  <div className="text-center bg-slate-100 py-3 rounded border">
                    <span className="text-xs text-slate-500 block uppercase">Código de Guía</span>
                    <span className="text-2xl font-black font-mono tracking-widest">{etiquetaGenerada.codigo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-bold block text-slate-500 text-xs">REMITENTE:</span>
                      <p className="font-semibold">{etiquetaGenerada.remitente}</p>
                    </div>
                    <div>
                      <span className="font-bold block text-slate-500 text-xs">DESTINATARIO:</span>
                      <p className="font-semibold">{etiquetaGenerada.destinatario}</p>
                      <p className="text-xs text-slate-600">{etiquetaGenerada.direccion}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xs font-bold">
                    <span>BULTOS: {etiquetaGenerada.bultos}</span>
                    <span>MAR DEL PLATA</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition"
                  >
                    🖨️ Imprimir Etiqueta PDF
                  </button>
                  <button
                    onClick={() => setEtiquetaGenerada(null)}
                    className="bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-300 transition"
                  >
                    Nueva Etiqueta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACTO */}
        {tab === "contacto" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Atención al Cliente & Depósito</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                <h3 className="font-bold text-red-600 text-base">📍 Dirección Depósito</h3>
                <p className="text-slate-700">Avenida Libertad 5943 / Malvinas 970</p>
                <p className="text-slate-500 text-xs">Mar del Plata, Buenos Aires</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                <h3 className="font-bold text-red-600 text-base">⏰ Horarios de Atención</h3>
                <p className="text-slate-700">Lunes a Viernes: 06:00 a 13:30 hs</p>
                <p className="text-slate-700">Sábados: 06:00 a 10:30 hs</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
