import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  
  // Extraer parámetros opcionales de la URL si se pasa por GET
  const url = new URL(request.url);
  const sender = url.searchParams.get("sender") || "Transporte Ramón";
  const recipient = url.searchParams.get("recipient") || "Cliente";
  const destination = url.searchParams.get("destination") || "Mar del Plata";
  const packages = url.searchParams.get("packages") || "1";

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Etiqueta ${code}</title>
      <style>
        @page { size: A6 portrait; margin: 0; }
        body {
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 15px;
          background: #fff;
          color: #000;
        }
        .label-card {
          border: 3px solid #000;
          border-radius: 8px;
          padding: 15px;
          max-width: 380px;
          margin: auto;
          box-sizing: border-box;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-b: 3px solid #000;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .brand { font-size: 18px; font-weight: 900; color: #dc2626; }
        .tag { background: #000; color: #fff; font-size: 10px; font-weight: bold; padding: 3px 6px; border-radius: 4px; }
        .code-box {
          text-align: center;
          background: #f1f5f9;
          border: 2px dashed #000;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 6px;
        }
        .code-title { font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase; }
        .code-num { font-size: 26px; font-family: monospace; font-weight: 900; letter-spacing: 2px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 15px; }
        .field-label { font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; }
        .field-val { font-weight: bold; margin-top: 2px; }
        .footer {
          border-top: 2px solid #000;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: bold;
        }
        @media print {
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align:center; margin-bottom:15px;">
        <button onclick="window.print()" style="background:#dc2626; color:#fff; border:none; padding:10px 20px; font-weight:bold; border-radius:6px; cursor:pointer;">
          🖨️ Imprimir Etiqueta
        </button>
      </div>
      <div class="label-card">
        <div class="header">
          <span class="brand">TRANSPORTE RAMÓN</span>
          <span class="tag">EXPRESO</span>
        </div>
        <div class="code-box">
          <div class="code-title">N° de Guía / Tracking</div>
          <div class="code-num">${code}</div>
        </div>
        <div class="grid">
          <div>
            <div class="field-label">Remitente</div>
            <div class="field-val">${sender}</div>
          </div>
          <div>
            <div class="field-label">Destinatario</div>
            <div class="field-val">${recipient}</div>
            <div style="font-size:10px; color:#475569;">${destination}</div>
          </div>
        </div>
        <div class="footer">
          <span>BULTOS: ${packages}</span>
          <span>MAR DEL PLATA</span>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
