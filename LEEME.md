# Transportes Ramón — código completo actualizado

Esta carpeta contiene el código de las dos páginas del sistema publicado:

- **Página pública:** `/` — consulta del estado mediante el código de seguimiento.
- **Panel de administración:** `/admin` — carga de paquetes, etiquetas PDF, búsqueda y cambios de estado individuales o grupales.

## Archivos principales

| Función | Archivo |
|---|---|
| Página pública | `app/page.tsx` |
| Panel de administración | `app/admin/page.tsx` |
| Selector y cambio grupal | `app/admin/bulk-controls.tsx` |
| Acciones para crear y actualizar | `app/admin/actions.ts` |
| Etiqueta PDF de cada paquete | `app/admin/etiqueta/[code]/route.ts` |
| Generación interna del PDF | `lib/label-pdf.ts` |
| Descarga del respaldo | `app/admin/export/route.ts` |
| Diseño de las dos páginas | `app/globals.css` |
| Consultas y cambios de envíos | `lib/shipments.ts` |
| Cuentas autorizadas | `lib/admin.ts` |
| Estructura de la base de datos | `db/schema.ts` |
| Migraciones de la base | `drizzle/` |
| Logo | `public/ramon-logo.jpg` |

## Funciones incluidas

- Código único para cada paquete.
- Consulta pública del estado y del historial.
- Número de remito o referencia.
- Nombre del remitente y del destinatario.
- Origen y destino.
- Estados: Recién despachado, En camino, Listo para retirar y Retirado.
- Etiqueta PDF individual de 10 × 15 cm para imprimir y pegar en la caja.
- Selección de varios paquetes para cambiarles el estado al mismo tiempo.
- Buscador y paginación del panel.
- Respaldo manual completo en JSON.
- Acceso administrativo limitado a correos autorizados.

## Instalación

Requiere Node.js 22.13 o posterior y pnpm 11.25 o compatible.

```bash
pnpm install
pnpm build
```

Para preparar una base D1 local después de compilar:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_acoustic_starfox.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_wonderful_prodigy.sql
```

Para iniciar el proyecto:

```bash
pnpm dev
```

La dirección local habitual es `http://localhost:5173`.

## Administración

Los correos autorizados están en `lib/admin.ts`. Para agregar otro administrador, sumá su correo a `ADMIN_EMAILS` y publicá nuevamente.

El inicio de sesión actual utiliza la autenticación proporcionada por ChatGPT Sites. Si se lleva el código a otro proveedor, hay que conectar su propio sistema de autenticación y una base de datos compatible.

## Sitio publicado

- Pública: `https://transporteramonseguimiento.rociobertino93.chatgpt.site`
- Administración: `https://transporteramonseguimiento.rociobertino93.chatgpt.site/admin`

