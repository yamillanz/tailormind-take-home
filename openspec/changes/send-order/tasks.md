# Tasks — send-order

## 1. Payload y tests

- [ ] 1.1 Crear `src/scripts/order-payload.ts` con `construirPayload(lines, items, cliente)` puro según design D3 (mapea líneas al contrato `orders-api`, total = Σ cantidad × precioUnitario, fail-fast si falta un id); verificación: revisión contra specs/send-order y specs/orders-api
- [ ] 1.2 Crear `src/scripts/order-payload.test.ts`: payload coherente (items exactos + total), carrito vacío → error, id inexistente → error; verificación: `npm test` en verde

## 2. UI e integración

- [ ] 2.1 Ajustar `cart-ui.ts` y `cart.ts`: render de líneas+total en `#cart-body` (el form sale del resumen), exportar `clearCart()`, despachar `cart:cambio` (detail `{hayLineas}`) tras cada render; verificación: carrito sigue funcionando igual (unit + build)
- [ ] 2.2 Modificar `src/pages/index.astro`: aside con `#cart-body`, form estático `#order-form` (Nombre `required`, Email `required type="email"`, botón "Enviar orden") y `#order-status` vacío; verificación: `npm run build` sin errores
- [ ] 2.3 Crear `src/scripts/order.ts`: submit con `preventDefault`, estado del botón (deshabilitado + "Enviando…"), POST `text/plain` según D4, éxito → `clearCart()` + Alert success con fila + `form.reset()`, `ok:false` → mensaje del servidor, red → genérico, botón re-habilitado; ocultar/mostrar form según `cart:cambio`; verificación: revisión contra specs/send-order escenario por escenario
- [ ] 2.4 Actualizar `DESIGN.md`: definir `FieldInput` (markup del helper/HTML estático) y nota de que CartSummary delega el checkout a `#order-form`/`#order-status`; verificación: tabla coherente con el código

## 3. Verificación E2E en navegador

- [ ] 3.1 Éxito interceptado (Playwright): completar form con carrito poblado → respuesta `{ok:true,fila:99}` → confirmación con fila, carrito vacío (localStorage incluido) y form reseteado; verificación: snapshot del DOM y localStorage
- [ ] 3.2 Rechazo del servidor interceptado: `{ok:false,error:"Email inválido…"}` → mensaje visible, carrito y datos del form intactos, botón habilitado; verificación: snapshot antes/después
- [ ] 3.3 Fallo de red (abort): mensaje genérico, carrito intacto, botón habilitado; verificación: snapshot
- [ ] 3.4 Validación HTML5: submit con campos vacíos → bloqueado por el navegador, cero peticiones al endpoint; verificación: contador de peticiones en la intercepción
- [ ] 3.5 POST real contra el endpoint desplegado (sin interceptar): confirmación con fila real y fila nueva visible en la pestaña `órdenes` (deja una fila de prueba — documentada en el change, borrable a mano); verificación: respuesta ok:true y fila en el Sheet
