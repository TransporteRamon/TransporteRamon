import { NextResponse } from "next/server";
import { getShipment } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") || "").trim();

  if (!code) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
  }

  try {
    const shipment = await getShipment(code);
    if (!shipment) {
      return NextResponse.json({ error: "Envío no encontrado" }, { status: 404 });
    }
    return NextResponse.json(shipment);
  } catch (error) {
    console.error("Error al buscar envío:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
