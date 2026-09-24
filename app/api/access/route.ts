import { NextResponse } from "next/server";
import { getShipment, getAllShipments, createShipment, updateShipmentStatus } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  try {
    if (code) {
      const shipment = await getShipment(code);
      if (!shipment) return NextResponse.json({ error: "Envío no encontrado" }, { status: 404 });
      return NextResponse.json(shipment);
    }
    const shipments = await getAllShipments();
    return NextResponse.json(shipments);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, sender, recipient, destination, packages, status } = body;

    if (!code || !recipient) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const nuevo = await createShipment({
      code,
      sender: sender || "Transporte Ramón",
      recipient,
      destination: destination || "Mar del Plata",
      packages: Number(packages) || 1,
      status: status || "EN_DEPOSITO",
    });

    return NextResponse.json({ success: true, shipment: nuevo });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: "No se pudo guardar en Neon" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { code, status } = body;

    if (!code || !status) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    await updateShipmentStatus(code, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API PATCH Error:", error);
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}
