"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [resultadoEnvio, setResultadoEnvio] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoBusqueda.trim()) return;

    setCargando(true);
    setErrorBusqueda("");
    setResultadoEnvio(null);

    try {
      const code = codigoBusqueda.trim().toUpperCase();
      const res = await fetch(`/api/access?code=${code}`);
      const data = await res.json();

      if (res.ok && data && (data.code || data.guia)) {
        setResultadoEnvio(data);
      } else {
        setErrorBusqueda("No se encontró ningún envío guardado con ese código de guía.");
      }
    } catch (err) {
      setErrorBusqueda("Error de conexión al buscar la guía.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#fff", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "32px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", color: "#ef4444", fontWeight: "900" }}>TRANSPORTE RAMÓN</h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>Logística & Distribución - Mar del Plata</p>
          </div>
          <Link href="/admin" style={{ background: "#dc2626", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: "bold" }}>
            Panel Admin ⚙️
          </Link>
        </div>

        {/* Buscador */}
        <div style={{ background: "#1e293b", padding: "32px", borderRadius: "16px", border: "1px solid #334155", textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "22px" }}>¿Dónde está tu paquete?</h2>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8" }}>Ingresá el número de guía asignado (ej: TR-872440) para consultar el estado en tiempo real.</p>

          <form onSubmit={handleBuscar} style={{ display: "flex", gap: "10px", maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Ej: TR-872440"
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
              required
              style={{ flex: 1, padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", textTransform: "uppercase" }}
            />
            <button
              type="submit"
              disabled={cargando}
              style={{ background: "#dc2626", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              {cargando ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>

        {/* Resultado */}
        {resultadoEnvio && (
          <div style={{ background: "#1e293b", padding: "24px", borderRadius: "16px", border: "1px solid #059669" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold" }}>N° DE GUÍA</span>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#ef4444", fontFamily: "monospace" }}>{resultadoEnvio.code}</div>
              </div>
              <span style={{ background: "#065f46", color: "#a7f3d0", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                ● {resultadoEnvio.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "13px", marginBottom: "20px" }}>
              <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px" }}>
                <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>REMITENTE</span>
                <strong>{resultadoEnvio.sender}</strong>
              </div>
              <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px" }}>
                <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>DESTINATARIO</span>
                <strong>{resultadoEnvio.recipient}</strong>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{resultadoEnvio.destination}</div>
              </div>
              <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px" }}>
                <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>BULTOS</span>
                <strong>{resultadoEnvio.packages} Bulto(s)</strong>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <a
                href={`/api/label/${resultadoEnvio.code}?sender=${encodeURIComponent(resultadoEnvio.sender)}&recipient=${encodeURIComponent(resultadoEnvio.recipient)}&destination=${encodeURIComponent(resultadoEnvio.destination)}&packages=${resultadoEnvio.packages}`}
                target="_blank"
                style={{ background: "#dc2626", color: "#fff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "12px", display: "inline-block" }}
              >
                📄 Ver / Imprimir Etiqueta Oficial PDF
              </a>
            </div>
          </div>
        )}

        {errorBusqueda && (
          <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "16px", borderRadius: "12px", textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>
            {errorBusqueda}
          </div>
        )}

      </div>
    </div>
  );
}
