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

> TODO: documentar supuestos (precios, moneda, IDs, stock, formato de email, etc.)
