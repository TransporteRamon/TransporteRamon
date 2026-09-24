import { getShipment } from "../../lib/database";
import Link from "next/link";

export default async function Seguimiento({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const p = await searchParams;
  const code = (p.code || "").trim();

  let ship: any = null;
  let errorMsg = "";

  if (code) {
    try {
      ship = await getShipment(code);
    } catch (e) {
      console.error("Error al consultar envío:", e);
      errorMsg = "Ocurrió un inconveniente al consultar la base de datos.";
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-red-600">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-red-600 text-white font-black text-xl px-3 py-1 rounded">TR</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TRANSPORTE RAMÓN</h1>
              <p className="text-xs text-slate-400">Seguimiento de Envíos</p>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg font-semibold transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Consulta de Guía</h2>
          <p className="text-slate-500 text-sm mb-6">Estado en tiempo real de tu envío</p>

          <form action="/seguimiento" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="text"
              name="code"
              defaultValue={code}
              placeholder="Número de Guía (ej: TR-872440)"
              className="flex-1 p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold text-slate-800 uppercase"
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-red-700 transition"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Resultado Encontrado */}
        {ship && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Código de Envío</span>
                <p className="text-2xl font-black text-red-600 font-mono">{ship.code || code}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                ship.status === "ENTREGADO" || ship.status === "Entregado" ? "bg-green-100 text-green-800" :
                ship.status === "EN_REPARTO" || ship.status === "En Reparto" ? "bg-yellow-100 text-yellow-800" :
                "bg-blue-100 text-blue-800"
              }`}>
                {ship.status || "EN_DEPOSITO"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border">
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase">Remitente</span>
                <span className="font-semibold text-slate-800">{ship.sender || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase">Destinatario</span>
                <span className="font-semibold text-slate-800">{ship.recipient || "-"}</span>
                {ship.destination && <p className="text-xs text-slate-500">{ship.destination}</p>}
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase">Bultos</span>
                <span className="font-semibold text-slate-800">{ship.packages || 1}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase">Última Actualización</span>
                <span className="font-semibold text-slate-800">
                  {ship.createdAt ? new Date(ship.createdAt).toLocaleDateString("es-AR") : "Hoy"}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a
                href={`/api/label/${ship.code || code}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-black transition text-sm"
              >
                🖨️ Descargar / Imprimir Etiqueta PDF
              </a>
            </div>
          </div>
        )}

        {/* Sin Resultados */}
        {code && !ship && !errorMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl text-center font-medium">
            No se encontró ningún envío registrado con el código <strong className="font-mono">{code}</strong>.
            <p className="text-xs text-amber-600 mt-1">Verificá que el código ingresado sea el correcto o consulta a través del panel de administración.</p>
          </div>
        )}

        {/* Error inesperado */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-center font-medium">
            {errorMsg}
          </div>
        )}
      </main>
    </div>
  );
}
