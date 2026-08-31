# Proposal — send-order

## Why

El PRD (§3.4) exige el botón "Enviar orden" que hace POST al endpoint de Apps Script y agrega una fila a la pestaña `órdenes` con nombre, email, items, total y timestamp. El contrato `orders-api` ya está especificado y verificado E2E (curl); falta la pieza final del frontend: el checkout.

## What Changes

- **Formulario de checkout** dentro del panel del carrito (visible solo con líneas): campos nombre y email (HTML5: `required`, `type="email"`) + botón primario "Enviar orden".
- **Envío**: POST al endpoint con el payload del contrato `{ cliente: {nombre, email}, items: [{id, nombre, cantidad, precioUnitario}], total }` — `Content-Type: text/plain` (sin preflight, según contrato); items y total construidos desde el menú vigente y las líneas del carrito.
- **Estado enviando**: botón deshabilitado con texto "Enviando…" — imposible el doble envío.
- **Éxito** (`ok: true`): Alert success con confirmación (número de fila), carrito vaciado (memoria + localStorage) y formulario reseteado.
- **Error** (`ok: false` o fallo de red): Alert error con el mensaje del servidor (o mensaje genérico de red), carrito intacto y botón re-habilitado para reintentar.
- Tests unitarios del constructor de payload (coherencia total = Σ cantidad × precioUnitario).

## Capabilities

### New Capabilities

- `send-order`: checkout del carrito — formulario (nombre, email), POST al endpoint según el contrato `orders-api`, y feedback de éxito/error con vaciado de carrito.

### Modified Capabilities

_(ninguna — el panel del carrito gana el formulario pero ningún requirement de `cart` cambia: líneas, stepper, total y persistencia quedan intactos)_

## Impact

- Nuevos: `src/scripts/order.ts` (controlador + constructor de payload), tests del payload, markup del formulario en `cart-ui.ts`.
- Modificados: `src/scripts/cart-ui.ts` (form + botón en el resumen), `src/scripts/cart.ts` (exponer estado del carrito al controlador de orden), `DESIGN.md` (FieldInput + nota de CartSummary).
- Sin cambios de backend: `orders-api` ya soporta exactamente este payload (verificado con curl en el change contrato).
- Una fila de prueba real en `órdenes` durante la verificación E2E final (documentada; se puede borrar a mano).
