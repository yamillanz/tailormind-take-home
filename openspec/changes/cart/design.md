# Design — cart

## Context

`menu-page` archived: tarjetas renderizadas en runtime por helpers TS (decisión D3 de ese change — sin markup duplicado en `.astro`). `menu-api` entrega `{id,nombre,descripcion,precio}` filtrado por disponibilidad. Stack fijado: Astro + Tailwind v4, vanilla JS, sin framework. Ver proposal.md.

## Goals / Non-Goals

**Goals:**
- Lógica de carrito **pura y testeada** (el PRD pide "tests donde importen" — el total es el lugar obvio).
- Persistencia robusta y reconciliación con el menú vigente (precios siempre frescos).

**Non-Goals:**
- Sin checkout: nombre/email/POST llegan con `send-order`.
- Sin backend, sin stock real (el máximo 99 es un tope arbitrario de UI, no inventario).
- Sin descuentos/cupones/propinas.

## Decisions

### D1 — Lógica pura separada del DOM (`src/scripts/cart-logic.ts`)
Estado del carrito = `CartLine[]` con `CartLine = { id: string; cantidad: number }`. Funciones puras: `agregar(lines, id)`, `cambiarCantidad(lines, id, delta)`, `quitar(lines, id)`, `total(lines, precios)`, `serializar/parsear`, `reconciliar(lines, menu)`. Los precios NO viven en el estado: se pasan como mapa `{ [id]: precio }` calculado desde el menú vigente.
*Alternativa:* guardar `{id, nombre, precio, cantidad}` — duplica la fuente de verdad y muestra precios viejos tras un cambio en el Sheet. Descartado.

### D2 — Persistencia: localStorage, solo `{id, cantidad}`
Key `tailormind-cart-v1`. Escritura en cada mutación; lectura con try/catch (JSON corrupto o storage bloqueado → carrito vacío en memoria, la app nunca se rompe).
*Alternativa:* sessionStorage (no sobrevive pestañas nuevas) o IndexedDB (overkill). localStorage es el estándar para esto.

### D3 — Reconciliación al hidratar
Al cargar el menú se hidrata el carrito: líneas con `id` inexistente en el menú se descartan; cantidades fuera de 1–99 se ajustan al rango. Orden: menú cargado → hidratar → render.

### D4 — UI client-side con helpers TS (misma técnica que menu-page D3)
`src/scripts/cart-ui.ts` genera el markup: líneas (nombre, precio unit., stepper, subtotal, quitar), bloque de total y mensaje de vacío — clases de DESIGN.md (Button primary/ghost, alertas). Layout: grid de 2 columnas en `lg` (menú + aside sticky del carrito), apilado en mobile con el carrito debajo del menú.
Eventos por **delegación** (un listener en el contenedor del carrito + uno global para "Agregar"): funciona con markup re-renderizado sin re-bindear.

### D5 — Tests: Vitest, unit sobre `cart-logic`
`npm i -D vitest` + script `"test": "vitest run"`. Los tests mapean 1:1 los escenarios del spec: agregar nuevo/existente, límites 1–99, quitar, total = Σ cantidad×precio, roundtrip de persistencia, reconciliación descarta ids ajenos. Funciones puras → sin jsdom ni mocks de storage (parse/serialize probados como funciones).

### D6 — Accesibilidad
`aria-live="polite"` en el total (DESIGN.md lo manda), steppers con `aria-label` ("Quitar una unidad de X", "Agregar una unidad de X") y quitar con texto real.

## Risks / Trade-offs

- [localStorage deshabilitado (modo privado estricto)] → try/catch en D2: el carrito funciona en memoria, solo no persiste.
- [Precio cambia con el carrito abierto] → los precios se resuelven en cada render desde el menú vigente; el total nunca queda "pegado" a un valor persistido.
- [Máximo 99 arbitrario] → documentado como supuesto de UI; evita overflow de stepper y spam accidental.
- [Re-render completo del carrito en cada cambio] → volumen ínfimo (< 100 líneas); simplicidad sobre micro-optimización.

## Migration Plan

Todo es código nuevo + un botón extra en `product-card.ts` + layout de `index.astro`. Rollback: revert; localStorage puede quedar con la key (inofensiva, se re-parsea o se ignora).

## Open Questions

Ninguna.
