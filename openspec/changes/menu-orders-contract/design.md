# Design — menu-orders-contract

## Context

Sheet ya creado (`1LiSljwBQH2IsHa9zsEiJlZ184SKTHRP8k8W66_e9C7I`), pestaña inicial vacía, acceso "viewer con link" (cambio hecho por el humano). El frontend será Astro estático en GitHub Pages — sin backend propio, sin secretos client-side. Todo el intercambio pasa por el URL `/exec` del Web App. Ver proposal.md para el alcance.

## Goals / Non-Goals

**Goals:**
- Contrato JSON estable y verificable con curl antes de escribir frontend.
- Transporte que funcione desde un navegador anónimo sin hacks frágiles (sin proxy, sin backend intermedio).
- Script mantenido como archivo versionado (`apps-script/Code.gs`) — el editor web de Apps Script es solo el runtime.

**Non-Goals:**
- No hay frontend en este change (ni fetch en Astro, ni UI).
- No hay recomputación server-side de precios contra `menú` (se usa el total del cliente + precios por ítem para auditoría).
- No hay autenticación, rate limiting ni categorías/estados de orden — supuestos documentados, material de "otra hora".

## Decisions

### D1 — Acceso al Sheet: propietario-only, puente "execute as me"
El Sheet queda restringido (viewer como máximo, sin permisos de edición públicos). El Web App se despliega **Execute as: me, Who has access: Anyone** — su autorización OAuth propia lee/escribe el Sheet.
*Alternativas:* sheet abierto a edición (riesgo de integridad de datos, innecesario); Sheets API con service account (requiere proyecto GCP + clave — imposible en site estático sin exponer credenciales).

### D2 — GET: `fetch` estándar, sin hacks
`/exec` responde 302 → `script.googleusercontent.com`, que sirve el contenido con `Access-Control-Allow-Origin: *`. `fetch(url)` con defaults (`redirect: follow`, `mode: cors`) funciona. Sin JSONP, sin `no-cors`.
*Verificación en tasks:* curl + fetch de navegador antes de consumirlo en Astro.

### D3 — POST: `text/plain` para esquivar preflight
Apps Script no atiende `OPTIONS`; un `Content-Type: application/json` dispara preflight y falla duro. Se envía `Content-Type: text/plain;charset=utf-8` con el JSON stringificado en el body (simple request, sin preflight); el script hace `JSON.parse(e.postData.contents)`.
*Alternativa:* `mode: 'no-cors'` (fire-and-forget, respuesta opaca — se pierde todo feedback de éxito/error; se descarta).

### D4 — Errores en el cuerpo, siempre HTTP 200
`ContentService` no permite fijar códigos de estado. Contrato: `{ ok: true, ... }` | `{ ok: false, error: "mensaje en español" }`. El frontend (cambios futuros) decide UI según `ok`, nunca según status HTTP.

### D5 — Esquemas de pestañas (nombres con acento, tal como el PRD)

```
menú                                    órdenes (append-only)
+------------+----------+--------+     +-----------+----------------+---------------+-------+----------+
| id         | nombre   | precio |     | timestamp | nombre_cliente | email_cliente | items | total    |
| (A1 header row; cols también         +-----------+----------------+---------------+-------+----------+
|  descripcion y disponible)            timestamp = ISO server-side (new Date().toISOString())
```

- `menú`: `id` (slug), `nombre`, `descripcion`, `precio` (entero CLP), `disponible` (TRUE/FALSE). `doGet` filtra `disponible = TRUE`.
- `órdenes`: `timestamp`, `nombre_cliente`, `email_cliente`, `items` (JSON string), `total`.
- IDs slug estables para el carrito; los números de fila NO son IDs (se mueven al ordenar).

### D6 — Timestamp server-side
El cliente nunca envía timestamp: `doPost` genera `new Date().toISOString()`. Relojes de cliente y formatos locales son fuente de bugs; el server es la verdad.

### D7 — Fuente de verdad del script en el repo
`apps-script/Code.gs` en el repo se copia/pega en el editor de Apps Script. Procedimiento operativo obligatorio tras cada edición: **Deploy → Manage deployments → edit → New version** (si no, `/exec` sigue sirviendo el código viejo). Documentado también para el README.

### D8 — El menú se consume en runtime (client-side fetch)
Menú cambia sin redeploys (decisión explorada en PRD §10; el fetch a `globalThis` del browser ocurre en cambios futuros). Aquí solo se garantiza que el contrato lo permite.

## Risks / Trade-offs

- [Redirección 302/CORS cambia o falla en algún navegador] → verificación temprana con curl y fetch real; en el peor caso `no-cors` como fallback degradado (sin feedback), decisión futura si ocurriera.
- [Órdenes basura (endpoint público sin auth)] → aceptado para take-home; validación mínima + volumen bajo. Documentado en supuestos.
- [Edición de código sin republicar versión] → D7 convierte el redeploy en paso explícito de la lista de tasks.
- [`total` del cliente es manipulable] → limitación consciente; los precios por ítem quedan auditables en `items`. Recomputar contra `menú` es "otra hora".
- [Pestañas con acento (`menú`, `órdenes`)] → `getSheetByName` las soporta; los tests manuales de tasks las cubren.

## Migration Plan

1. Configurar pestañas y encabezados en el Sheet + datos semilla.
2. Pegar `Code.gs` en Apps Script, autorizar, desplegar (Execute as me / Anyone).
3. Verificar con curl: GET del menú, POST de una orden de prueba, fila en `órdenes`.
4. Rollback: desplegar versión anterior del script (manage deployments) — el Sheet nunca pierde datos (append-only).

## Open Questions

Ninguna bloqueante: la copia exacta de los mensajes de error (español) se fija en la implementación de `Code.gs`.
