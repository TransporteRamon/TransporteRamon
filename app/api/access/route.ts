import { NextResponse } from "next/server";
import { getShipment } from "@/lib/database";

export const dynamic = "force-dynamic";

// GET: Consultar un envío por su código de guía
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") || "").trim();

  if (!code) {
    return NextResponse.json({ error: "Se requiere un código de guía" }, { status: 400 });
  }

  try {
    const shipment = await getShipment(code);
    if (!shipment) {
      return NextResponse.json({ error: "Envío no encontrado" }, { status: 404 });
    }
    return NextResponse.json(shipment);
  } catch (error) {
    console.error("Error al consultar envío:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST: Registrar envío
export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, shipment: body });
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar datos" }, { status: 400 });
  }
}
