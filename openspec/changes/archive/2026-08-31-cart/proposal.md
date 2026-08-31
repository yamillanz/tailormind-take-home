# Proposal — cart

## Why

El PRD (§3.3) exige un carrito client-side: agregar/quitar ítems, ver subtotales y total. La página de menú ya muestra las tarjetas (`menu-page` archived); el carrito es la siguiente pieza y el prerrequisito directo del checkout (`send-order`).

## What Changes

- Botón **"Agregar"** en cada tarjeta del menú: suma 1 unidad del producto al carrito (o crea la línea si no existe).
- **Carrito visible** en la página (aside fijo en desktop, bloque bajo el menú en mobile) con:
  - línea por producto: nombre, precio unitario, stepper cantidad (− / cantidad / +), subtotal de línea, botón quitar;
  - **total** = Σ (cantidad × precio), formateado CLP, con `aria-live="polite"` (regla de DESIGN.md).
- **Persistencia local** (localStorage): el carrito sobrevive recargas; se guardan solo pares `{id, cantidad}` — nombre y precio SIEMPRE se resuelven contra el menú actual al renderizar (nunca se persisten precios).
- Líneas cuyo `id` ya no exista en el menú disponible se descartan silenciosamente al hidratar.
- **Tests unitarios** de la lógica pura del carrito (agregar/quitar/cantidad/total/hidratación) con Vitest (`npm test`).

## Capabilities

### New Capabilities

- `cart`: estado y comportamiento del carrito client-side — agregar/quitar ítems, cantidades, subtotales por línea, total, persistencia local y reconciliación con el menú vigente.

### Modified Capabilities

- `menu-page`: cada tarjeta del menú ahora incluye el botón "Agregar" (delta pequeño sobre un requirement existente; el resto de la página no cambia).

## Impact

- Nuevos: `src/scripts/cart-logic.ts` (lógica pura, testeable), tests Vitest, aside del carrito en `index.astro`, script del carrito.
- Modificados: `src/scripts/product-card.ts` (botón Agregar), `src/pages/index.astro` (layout 2 columnas + contenedor carrito), `package.json` (vitest + script `test`), `DESIGN.md` (componentes QuantityStepper/CartSummary quedan definidos).
- Sin cambios de backend ni en `menu-api`/`orders-api`.
- Checkout (nombre, email, POST) NO está aquí — es el change `send-order`.
