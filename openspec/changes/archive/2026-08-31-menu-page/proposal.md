# Proposal — menu-page

## Why

El PRD (§3.1–3.2) exige una página que lea los productos desde Google Sheets y los renderice como tarjetas (nombre, descripción, precio). El contrato de datos ya existe y está verificado (capacidad `menu-api`, archive `2026-08-31-menu-orders-contract`); falta el consumo desde el frontend estático.

## What Changes

- Nueva página principal (`src/pages/index.astro`) que obtiene el menú **en runtime** (client-side fetch al URL `/exec` del Web App, decisión D8 del change anterior) y muestra cada producto como tarjeta: nombre, descripción, precio formateado en CLP.
- Estados de UI obligatorios según DESIGN.md:
  - **Loading**: skeletons mientras llega la respuesta.
  - **Vacío**: `ok: true` con `items: []` → Alert info "No hay productos disponibles".
  - **Error**: fallo de red o `ok: false` → Alert error con botón "Reintentar" que repite el fetch.
- Configuración del endpoint en `src/config.ts` (URL público por diseño, ver supuestos).
- Componentes según DESIGN.md: `ProductCard` (markup compartido), `Alert`, `Skeleton`.

## Capabilities

### New Capabilities

- `menu-page`: comportamiento de la página pública — mostrar el menú en tarjetas a partir de `menu-api` en runtime, con estados de carga, vacío y error (+ reintento).

### Modified Capabilities

_(ninguna — `menu-api` no cambia; la página es una consumidora)_

## Impact

- `src/pages/index.astro` (reemplaza el placeholder actual), nuevo `src/config.ts`, nuevos componentes/helpers en `src/components/` y `src/scripts/`.
- Sin cambios de backend: el Web App y el Sheet quedan intactos.
- `DESIGN.md`: se completa la definición de `ProductCard`/`Skeleton`/`Alert` al implementarlas (no cambia reglas).
- El carrito (change `cart`) agregará el botón "Agregar" a las tarjetas después — fuera de alcance aquí.
