"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Envio {
  id?: number;
  code: string;
  sender: string;
  recipient: string;
  destination: string;
  packages: number;
  status: string;
}

export default function AdminPage() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

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
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setCode(generarGuia());
    cargarEnvios();
  }, []);

  const handleCrearEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("Guardando en Neon...");

    const nuevoEnvio = {
      code,
      sender: sender || "Transporte Ramón",
      recipient,
      destination: destination || "Mar del Plata",
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
        setMensaje("✅ Envío registrado en la base de datos");
        setCode(generarGuia());
        setSender("");
        setRecipient("");
        setDestination("");
        setPackages(1);
        setStatus("EN_DEPOSITO");
        await cargarEnvios();
      } else {
        setMensaje("⚠️ Error al guardar en base de datos.");
      }
    } catch (error) {
      setMensaje("❌ Error de conexión.");
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
      await cargarEnvios();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#fff", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", border: "1px solid #334155" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>Panel de Control Operativo</h1>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>Transporte Ramón - Base de Datos Conectada</p>
          </div>
          <Link href="/" style={{ background: "#334155", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: "bold" }}>
            Ver Sitio Público →
          </Link>
        </div>

        {/* Formulario */}
        <div style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "16px", marginTop: 0, marginBottom: "16px", borderBottom: "1px solid #334155", paddingBottom: "8px" }}>Cargar Nuevo Envío</h2>
          
          {mensaje && <div style={{ background: "#065f46", color: "#a7f3d0", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", marginBottom: "16px" }}>{mensaje}</div>}

          <form onSubmit={handleCrearEnvio} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}>N° GUÍA / CÓDIGO</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", color: "#ef4444", borderRadius: "6px", fontWeight: "bold", fontFamily: "monospace" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}>REMITENTE (ENVÍA)</label>
              <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Ej: Distribuidora SRL" style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}>DESTINATARIO (RECIBE)</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required placeholder="Ej: Juan Pérez" style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}>DIRECCIÓN / DESTINO</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ej: Av. Libertad 5943" style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}>BULTOS</label>
              <input type="number" min="1" value={packages} onChange={(e) => setPackages(Number(e.target.value))} required style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}>ESTADO INICIAL</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: "10px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }}>
                <option value="EN_DEPOSITO">En Depósito</option>
                <option value="EN_TRANSITO">En Tránsito</option>
                <option value="EN_REPARTO">En Reparto</option>
                <option value="ENTREGADO">Entregado</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1", paddingTop: "8px" }}>
              <button type="submit" disabled={loading} style={{ width: "100%", background: "#dc2626", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
                {loading ? "Guardando..." : "💾 Guardar Envío en Base de Datos"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "16px", marginTop: 0, marginBottom: "16px", borderBottom: "1px solid #334155", paddingBottom: "8px" }}>Envíos Registrados ({envios.length})</h2>
          {envios.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "20px 0", fontSize: "14px" }}>No hay envíos registrados en la base de datos.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                  <th style={{ padding: "8px" }}>CÓDIGO</th>
                  <th style={{ padding: "8px" }}>DESTINATARIO</th>
                  <th style={{ padding: "8px" }}>BULTOS</th>
                  <th style={{ padding: "8px" }}>ESTADO</th>
                  <th style={{ padding: "8px" }}>ETIQUETA</th>
                </tr>
              </thead>
              <tbody>
                {envios.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #334155" }}>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: "bold", color: "#ef4444" }}>{item.code}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <strong>{item.recipient}</strong>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{item.destination}</div>
                    </td>
                    <td style={{ padding: "10px 8px", fontWeight: "bold" }}>{item.packages}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <select value={item.status} onChange={(e) => handleCambiarEstado(item.code, e.target.value)} style={{ background: "#0f172a", color: "#fff", border: "1px solid #334155", padding: "4px 8px", borderRadius: "4px" }}>
                        <option value="EN_DEPOSITO">En Depósito</option>
                        <option value="EN_TRANSITO">En Tránsito</option>
                        <option value="EN_REPARTO">En Reparto</option>
                        <option value="ENTREGADO">Entregado</option>
                      </select>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <a href={`/api/label/${item.code}?sender=${encodeURIComponent(item.sender)}&recipient=${encodeURIComponent(item.recipient)}&destination=${encodeURIComponent(item.destination)}&packages=${item.packages}`} target="_blank" style={{ background: "#0f172a", color: "#fff", padding: "6px 12px", border: "1px solid #334155", borderRadius: "6px", textDecoration: "none", fontSize: "11px", fontWeight: "bold" }}>
                        📄 Imprimir PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
