# Tasks — cart

## 1. Lógica pura y tests

- [x] 1.1 Instalar Vitest (`npm i -D vitest`) y agregar script `"test": "vitest run"`; verificación: `npm test` corre (aún sin tests, con `--passWithNoTests` mientras)
- [x] 1.2 Crear `src/scripts/cart-logic.ts` con funciones puras según design D1: `agregar`, `cambiarCantidad` (límites 1–99), `quitar`, `total(lines, precios)`, `serializar`/`parsear`, `reconciliar(lines, menu)`; verificación: revisión contra specs/cart escenario por escenario
- [x] 1.3 Crear `src/scripts/cart-logic.test.ts` (Vitest) mapeando los escenarios del spec: agregar nuevo/existente, límites del stepper, quitar, total coherente, roundtrip de persistencia `{id,cantidad}` sin precios, reconciliación descarta ids ajenos; verificación: `npm test` en verde

## 2. UI del carrito

- [x] 2.1 Crear `src/scripts/cart-ui.ts`: markup de líneas (nombre, precio unitario, stepper − / cantidad / +, subtotal, quitar), bloque de total con `aria-live="polite"` y mensaje de carrito vacío, con clases de DESIGN.md; verificación: markup revisado contra DESIGN.md y specs/cart
- [x] 2.2 Modificar `src/scripts/product-card.ts`: agregar botón "Agregar" (primary) a cada tarjeta con `data-agregar="<id>"`; verificación: tarjetas renderizan el botón
- [x] 2.3 Crear `src/scripts/cart.ts` (controlador): hidratación tras cargar el menú (D3), delegación de eventos para agregar/stepper/quitar (D4), persistencia en cada mutación (D2), re-render del aside; verificación: revisión contra specs/cart
- [x] 2.4 Modificar `src/pages/index.astro`: layout 2 columnas en `lg` (grid menú + aside sticky `#cart`), carrito debajo del menú en mobile; verificación: `npm run build` sin errores
- [x] 2.5 Actualizar `DESIGN.md`: `QuantityStepper` y `CartSummary` apuntan a `src/scripts/cart-ui.ts`; verificación: tabla de componentes coherente con el código

## 3. Verificación E2E en navegador

- [x] 3.1 Happy path con Playwright: "Agregar" en 2 productos, subir/bajar cantidades, subtotales y total correctos, línea quitable; verificación: snapshot del DOM con valores esperados
- [x] 3.2 Persistencia con Playwright: recargar página con carrito poblado → líneas y totales restaurados con precios vigentes; verificación: snapshot antes/después del reload
- [x] 3.3 Reconciliación con Playwright: interceptar el menú sin un `id` persistido → línea descartada y total recalculado; verificación: snapshot muestra carrito sin la línea huérfana
- [x] 3.4 Accesibilidad: total con `aria-live="polite"`, steppers con `aria-label`, mensaje de vacío con `role="status"`; verificación: atributos presentes en el DOM
