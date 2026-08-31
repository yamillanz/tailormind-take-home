# TailorMind Take-Home — Menú de Restaurante con Carrito

App de menú de restaurante con carrito de compras. **Astro** (estático) + **Google Sheets** como backend vía **Google Apps Script Web App**.

## Live

> TODO: pegar URL del deploy cuando esté disponible.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Astro (estático, islands si hace falta) |
| Backend / datos | Google Sheets (pestañas `menú` y `órdenes`) |
| Puente | Google Apps Script Web App (`doGet` menú, `doPost` órdenes) |
| Deploy | GitHub Pages (Actions) |

## Desarrollo

```sh
npm install
npm run dev
npm run build
```

## Entregables (por completar)

- [ ] URL live del deploy (arriba)
- [ ] Párrafo: pasos simples para preparar una pizza
- [ ] Párrafo: qué haría con otra hora más
- [ ] Lista de supuestos
- [ ] `chat.md` — transcripción cruda de la conversación con Claude

## Supuestos

1. **Moneda:** precios enteros en CLP, sin columna de moneda ni decimales.
2. **IDs de producto:** slugs escritos a mano en la pestaña `menú` (`pizza-margarita`); la app los trata como strings opacos.
3. **Stock:** booleano `disponible` por producto (TRUE/FALSE); no hay control de cantidades por producto.
4. **Seguridad del Sheet:** el Sheet es owner-only (viewer como máximo); el puente es el Web App de Apps Script desplegado como "execute as me / anyone" — el navegador nunca toca el Sheet directamente.
5. **Códigos HTTP:** `doPost` siempre responde HTTP 200 (limitación de Apps Script); el resultado va en el cuerpo JSON (`ok` true/false).
6. **Timestamp y total:** el `timestamp` de la orden lo genera el servidor; el `total` lo calcula el cliente (manipulable — limitación aceptada; los precios por ítem quedan auditables en `items`).
7. **URLs públicas:** el URL del Web App y el Sheet ID son públicos (site estático); superficie de abuso = órdenes basura en `órdenes`, aceptada.
8. **Corte de alcance:** sin categorías de menú ni estados de orden (recibido/preparando/lista) — material de "otra hora".
