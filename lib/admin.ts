import {cookies} from "next/headers";
export async function isAdmin(){return (await cookies()).get("ramon_admin")?.value===process.env.ADMIN_KEY&&!!process.env.ADMIN_KEY;}
export async function setAdmin(){(await cookies()).set("ramon_admin",process.env.ADMIN_KEY||"",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:43200});}
export async function clearAdmin(){(await cookies()).delete("ramon_admin");}