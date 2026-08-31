# Proposal — menu-orders-contract

## Why

El PRD fija Google Sheets como backend con un puente Google Apps Script Web App (`doGet` menú, `doPost` órdenes). Hoy no existe nada de esa capa: el Sheet (ya creado) está vacío y no hay script. Todo lo demás (página de menú, carrito, envío de orden) consume este contrato, así que es el primer change aterrizable.

## What Changes

- Definir el esquema de la pestaña `menú`: `id`, `nombre`, `descripcion`, `precio`, `disponible`.
- Definir el esquema de la pestaña `órdenes` (append-only): `timestamp`, `nombre_cliente`, `email_cliente`, `items` (JSON), `total`.
- Crear el Apps Script Web App:
  - `doGet` → JSON del menú (solo filas con `disponible = TRUE`).
  - `doPost` → valida el payload y agrega una fila a `órdenes`.
- Estrategia de transporte/CORS:
  - GET con `fetch` estándar (`/exec` responde 302 → `script.googleusercontent.com` con `Access-Control-Allow-Origin: *`).
  - POST con `Content-Type: text/plain` para evitar preflight (Apps Script no atiende OPTIONS); el script parsea `e.postData.contents`.
  - Errores en el cuerpo (`{ ok: false, error }`) — Apps Script no puede fijar códigos HTTP.
- Operación: desplegar como "Execute as me / Anyone", publicar versión nueva tras cada cambio de código, compartir el Sheet solo como propietario (viewer como máximo).
- Cargar productos de ejemplo en `menú` para desarrollo y demo.
- Producir los supuestos documentados (moneda CLP, IDs slug, sin stock, etc.) para el README.

## Capabilities

### New Capabilities

- `menu-api`: servir el menú del restaurant desde Google Sheets vía Apps Script `doGet` (esquema de columnas, filtrado por disponibilidad y forma del JSON de respuesta).
- `orders-api`: recibir una orden vía Apps Script `doPost`, validarla y agregarla como fila a la pestaña `órdenes` (contrato de payload, validación mínima, convención de respuesta y error).

### Modified Capabilities

_(ninguna — primer change del proyecto)_

## Impact

- **Nuevo archivo** `apps-script/Code.gs` en el repo: fuente de verdad del script (se copia/pega en el editor de Apps Script).
- **Google Sheet existente** (`1LiSljwBQH2IsHa9zsEiJlZ184SKTHRP8k8W66_e9C7I`): estructura de pestañas, encabezados y datos semilla. Sin cambios de código frontend.
- **README**: nueva sección de supuestos.
- Cambios posteriores (`menu-page`, `cart`, `send-order`) consumen este contrato; ninguno toca código en este change.
- El URL del Web App y el ID del Sheet serán públicos (site estático) — superficie de abuso: órdenes basura en `órdenes`, aceptado para el take-home.
