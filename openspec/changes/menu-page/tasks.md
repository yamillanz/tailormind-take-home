# Tasks — menu-page

## 1. Config y helpers

- [ ] 1.1 Crear `src/config.ts` con `MENU_ENDPOINT` (URL `/exec` de `apps-script/README.md`); verificación: build pasa y el valor coincide con el URL desplegado
- [ ] 1.2 Crear `src/scripts/product-card.ts` con `productCardHTML(item)` usando las clases de tarjeta de DESIGN.md (`rounded-xl border border-stone-200 bg-white shadow-sm`, nombre `text-xl font-semibold`, descripción `text-sm text-stone-600`, precio en `amber-600`); verificación: markup generado revisado contra DESIGN.md
- [ ] 1.3 Crear formateador de precio con `Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })` (helper exportado o inline en product-card.ts); verificación: `9900` → `$9.900`

## 2. Página y estados

- [ ] 2.1 Crear `src/scripts/menu.ts`: máquina de estados `loading → success | empty | error` según design D6 — fetch a `MENU_ENDPOINT`, distinción fallo de red / `ok:false`, render de tarjetas en orden, `role="status"` en el contenedor de mensajes, botón "Reintentar" que reingresa a `loading`; verificación: revisión contra specs/menu-page escenario por escenario
- [ ] 2.2 Reemplazar `src/pages/index.astro`: layout existente, `h1` "Menú", contenedor `#menu` con skeletons iniciales (markup estático con la forma de ProductCard) e import del script; verificación: `npm run build` genera la página sin errores
- [ ] 2.3 Actualizar `DESIGN.md`: entrada de `ProductCard` apunta a `src/scripts/product-card.ts` (helper client-side) en vez de `.astro`; verificación: tabla de componentes coherente con el código

## 3. Verificación E2E en navegador

- [ ] 3.1 Happy path en dev server (`astro dev --background`) con Playwright: se renderizan exactamente las tarjetas del Sheet en orden, precios formateados CLP, sin skeletons residuales; verificación: snapshot del DOM muestra 6 tarjetas con datos correctos
- [ ] 3.2 Estado vacío simulando respuesta `{ok:true,items:[]}` (intercepción de la petición al endpoint en Playwright, sin tocar el Sheet): mensaje informativo visible y cero tarjetas; verificación: snapshot muestra el mensaje "No hay productos disponibles"
- [ ] 3.3 Estado de error simulando fallo de red (abort de la petición en Playwright): mensaje de error con botón "Reintentar"; al desbloquear la red y activar "Reintentar" aparecen skeletons y luego las tarjetas; verificación: snapshot antes/después del reintento
