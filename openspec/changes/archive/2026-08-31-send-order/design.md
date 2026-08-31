# Design — send-order

## Context

Contrato `orders-api` verificado: POST `text/plain` (sin preflight), payload `{cliente:{nombre,email}, items:[{id,nombre,cantidad,precioUnitario}], total}`, respuesta siempre HTTP 200 con `{ok:true,fila,timestamp}` o `{ok:false,error}` (español). El carrito (`cart` archived) renderiza líneas+total en `#cart-body` con helpers TS y persiste `{id,cantidad}`. Ver proposal.md.

## Goals / Non-Goals

**Goals:**
- Cerrar el flujo completo del PRD: menú → carrito → orden en la pestaña `órdenes`.
- Feedback inequívoco: éxito con fila asignada; error sin perder el carrito.

**Non-Goals:**
- Sin edición de cantidades desde el checkout (el stepper de `cart` ya lo hace).
- Sin reintentos automáticos ni timeouts (material "otra hora" B2).
- Sin validación custom de email más allá de HTML5 (`required` + `type="email"`); el servidor ya valida de nuevo (fuente de verdad).

## Decisions

### D1 — Formulario estático server-rendered + zonas separadas en el aside
El form (Nombre, Email, botón "Enviar orden") es HTML estático en `index.astro` (no necesita datos dinámicos). El aside queda dividido en tres nodos: `#cart-body` (líneas+total, re-renderizado por `cart.ts`), `#order-form` (estático) y `#order-status` (alertas, propiedad de `order.ts`). Así el feedback de orden NUNCA se pierde si el usuario muta el carrito durante el envío — cada nodo tiene un dueño.
*Alternativa:* un solo render del panel por `cart.ts` — el re-render borraría el feedback de error. Descartado.

### D2 — Visibilidad del form por evento
`cart.ts` despacha `cart:cambio` (detail `{hayLineas}`) tras cada render; `order.ts` oculta/muestra el form. El form se oculta (no se destruye) cuando el carrito está vacío: los datos tipeados sobreviven al vaciado si el usuario vuelve a agregar.

### D3 — Constructor de payload puro y testeado
`src/scripts/order-payload.ts`: `construirPayload(lines, items, cliente)` mapea cada línea a `{id, nombre, cantidad, precioUnitario}` desde el menú vigente y calcula `total` = Σ cantidad × precioUnitario. Si un `id` de línea no existe en el menú (no debería tras `reconciliar`), lanza error — fail fast, no órdenes incoherentes. Unit tests en Vitest.

### D4 — Envío: fetch `text/plain`, botón dueño del estado
`fetch(ORDER_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body })` — mismo transporte verificado en el contrato. El botón pasa a `disabled` con "Enviando…" desde el submit hasta la respuesta: imposible el doble envío (la única protección necesaria; no hay tokens).

### D5 — Éxito: vaciar y confirmar
`ok: true` → `clearCart()` (exportada por `cart.ts`: vacía memoria + localStorage + re-render) → Alert success en `#order-status` con el número de fila ("Orden enviada — fila N") → `form.reset()`.

### D6 — Error: mensaje servido, estado intacto
`ok: false` → Alert error con el mensaje del servidor (ya viene en español desde `Code.gs`). Fallo de red (`catch`) → mensaje genérico. En ambos: carrito y form intactos, botón re-habilitado — el reintento es inmediato y manual.

### D7 — E2E con un POST real
Los tres estados (éxito/rechazo/red) se verifican con intercepciones de Playwright (Sheet intacto), y además UN POST real contra el endpoint desplegado — es la única forma de probar el flujo completo navegador→Apps Script→Sheets (CORS incluido). Deja una fila de prueba en `órdenes` (aceptado; se borra a mano).

## Risks / Trade-offs

- [Respuesta lenta del endpoint] → el botón "Enviando…" comunica el estado; sin timeout deliberado (B2).
- [Usuario muta el carrito durante el envío] → el total enviado puede diferir del total final en pantalla; la fila de `órdenes` queda coherente con lo enviado. Edge raro y aceptado.
- [Doble submit] → prevenido por `disabled` durante el vuelo (D4).

## Migration Plan

Código nuevo + split del aside en `index.astro` (el HTML del carrito sigue en el mismo lugar). Rollback: revert — `órdenes` conserva la fila de prueba (append-only, inofensiva).

## Open Questions

Ninguna.
