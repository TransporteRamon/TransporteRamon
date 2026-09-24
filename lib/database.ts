import {neon} from "@neondatabase/serverless";
const sql=neon(process.env.DATABASE_URL||"");
export async function getShipment(code:string):Promise<any>{const rows=await sql.query("SELECT * FROM shipments WHERE upper(code)=upper($1) LIMIT 1",[code]);if(!rows[0])return null;const events=await sql.query("SELECT status,note,created_at FROM shipment_events WHERE shipment_id=$1 ORDER BY created_at ASC",[rows[0].id]);return {...rows[0],events};}
export async function listShipments(){return await sql.query("SELECT * FROM shipments ORDER BY created_at DESC LIMIT 200",[]);}