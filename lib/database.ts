import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(url);
}

export async function getShipment(code: string) {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM shipments WHERE UPPER(code) = UPPER(${code}) LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Error in getShipment:", error);
    return null;
  }
}

export async function getAllShipments() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM shipments ORDER BY created_at DESC LIMIT 50
    `;
    return rows;
  } catch (error) {
    console.error("Error in getAllShipments:", error);
    return [];
  }
}

export async function createShipment(data: {
  code: string;
  sender: string;
  recipient: string;
  destination: string;
  packages: number;
  status: string;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO shipments (code, sender, recipient, destination, packages, status)
    VALUES (${data.code}, ${data.sender}, ${data.recipient}, ${data.destination}, ${data.packages}, ${data.status})
    ON CONFLICT (code) DO UPDATE SET
      sender = EXCLUDED.sender,
      recipient = EXCLUDED.recipient,
      destination = EXCLUDED.destination,
      packages = EXCLUDED.packages,
      status = EXCLUDED.status
    RETURNING *
  `;
  return rows[0];
}

export async function updateShipmentStatus(code: string, status: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE shipments SET status = ${status} WHERE UPPER(code) = UPPER(${code}) RETURNING *
  `;
  return rows[0];
}
