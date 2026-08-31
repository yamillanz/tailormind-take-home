# TailorMind Take-Home — Menú de Restaurante con Carrito

App de menú de restaurante con carrito de compras. **Astro** (estático) + **Google Sheets** como backend vía **Google Apps Script Web App**.

## Live

**https://yamillanz.github.io/tailormind-take-home/**

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Astro (estático, islands para el carrito) |
| Backend / datos | Google Sheets (pestañas `menú` y `órdenes`) |
| Puente | Google Apps Script Web App (`doGet` menú, `doPost` órdenes) |
| Deploy | GitHub Pages (push a `main` → Actions) |

## Desarrollo

```sh
npm install
npm run dev
npm run build
npm test
```

Apps Script 部署与测试详见 [`apps-script/README.md`](apps-script/README.md)。

## Cómo preparar una pizza

Preparar una pizza es más simple de lo que parece. Primero, precalienta el horno a 220°C. Luego, sobre una base de masa ya extendida, unta una capa generosa de salsa de tomate, deja un borde de unos dos centímetros sin cubrir. Añade una capa de mozzarella rallada cubriendo toda la superficie, y después coloca los ingredientes que más te gusten: jamón, champiñones, pepperoni, aceitunas, o lo que tengas a mano. Rocía un chorrito de aceite de oliva y espolvorea orégano seco por encima. Mete la pizza en el horno durante 12 a 15 minutos, o hasta que el borde esté dorado y el queso burbujee. Saca la pizza con cuidado (¡la bandeja está caliente!), deja reposar dos minutos, corta en ocho porciones con un cuchillo o una ruleta de pizza, y sirve inmediatamente mientras el queso aún se estira. Si quieres una masa casera en lugar de comprada, mezcla 500g de harina con 325ml de agua tibia, 7g de levadura seca, 10g de sal y una cucharada de aceite de oliva, amasa durante diez minutos, deja reposar tapada con un paño durante dos horas hasta que duplique su tamaño, y luego sigue los pasos anteriores.

## ¿Qué haría con otra hora más?

Con una hora más, primero añadiría validación de email del lado del cliente más robusta (regex + confirmación visual en tiempo real, no solo HTML5), y un timeout con reintentos automáticos para el fetch del menú y el POST de órdenes, para que la app no se quede colgada si Apps Script tarda o falla. Después, añadiría persistencia del carrito con versionado de precios — guardar también el precio al momento de agregar, para que si el precio cambia mientras tienes productos en el carrito, el total mostrado sea el que el cliente acordó, no el actualizado. También añadiría un modal de confirmación antes de enviar la orden, con un resumen visual de los items y el total final, para que el cliente confirme antes de que el POST llegue al Sheet. Por último, y si aún sobraba tiempo, añadiría un indicador visual de "orden en preparación" que consulte periódicamente la pestaña `órdenes` y muestre el estado de la orden del cliente (recibido / preparando / listo) — esto requeriría modificar el `doGet` para aceptar un parámetro de búsqueda por email del cliente.

## Supuestos

1. **Moneda:** precios enteros en CLP, sin columna de moneda ni decimales.
2. **IDs de producto:** slugs escritos a mano en la pestaña `menú` (`pizza-margarita`); la app los trata como strings opacos.
3. **Stock:** booleano `disponible` por producto (TRUE/FALSE); no hay control de cantidades por producto.
4. **Seguridad del Sheet:** el Sheet es owner-only (viewer como máximo); el puente es el Web App de Apps Script desplegado como "execute as me / anyone" — el navegador nunca toca el Sheet directamente.
5. **Códigos HTTP:** `doPost` siempre responde HTTP 200 (limitación de Apps Script); el resultado va en el cuerpo JSON (`ok` true/false).
6. **Timestamp y total:** el `timestamp` de la orden lo genera el servidor; el `total` lo calcula el cliente (manipulable — limitación aceptada; los precios por ítem quedan auditables en `items`).
7. **URLs públicas:** el URL del Web App y el Sheet ID son públicos (site estático); superficie de abuso = órdenes basura en `órdenes`, aceptada.
8. **Corte de alcance:** sin categorías de menú ni estados de orden (recibido/preparando/lista) — material de "otra hora".
9. **Persistencia de carrito:** solo `{id, cantidad}` en localStorage; precios y nombres siempre resueltos contra el menú vigente en render (nunca persistidos), para que cambios de precio se reflejen al instante.
10. **Tope de cantidad:** máximo 99 unidades por línea (tope arbitrario de UI, no inventario real).
11. **Sin categorías de menú:** el PRD solo pide nombre, descripción, precio — no se añaden categorías, imágenes ni etiquetas.

## Entregables

- [x] URL live del deploy
- [x] Párrafo: pasos simples para preparar una pizza
- [x] Párrafo: qué haría con otra hora más
- [x] Lista de supuestos
- [x] `chat.md` — transcripción cruda de la conversación con Claude
