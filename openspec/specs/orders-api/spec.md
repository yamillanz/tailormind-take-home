# orders-api — Especificación

## Purpose

Recibir una orden desde el frontend estático vía Apps Script `doPost`, validarla de forma mínima y agregarla como fila a la pestaña `órdenes`, con una convención de respuesta/expiración explícita (errores en el cuerpo, no en códigos HTTP).

## Requirements

### Requirement: Recepción y persistencia de la orden
El `doPost` SHALL aceptar un cuerpo JSON enviado como `text/plain` con la estructura `{ "cliente": { "nombre", "email" }, "items": [ { "id", "nombre", "cantidad", "precioUnitario" } ], "total" }` y, cuando sea válido, SHALL agregar una fila a la pestaña `órdenes` con: `timestamp` (ISO generado por el servidor, no por el cliente), `nombre_cliente`, `email_cliente`, `items` (JSON string del arreglo recibido) y `total`.

#### Scenario: Orden válida se persiste
- **WHEN** se hace POST con payload válido (cliente con nombre y email, al menos un ítem, total coherente)
- **THEN** se agrega una fila a `órdenes` con timestamp del servidor en formato ISO y los datos recibidos, y la respuesta es `{ "ok": true, "fila": <número de fila>, "timestamp": "<iso>" }`

### Requirement: Validación mínima del payload
El `doPost` SHALL rechazar sin escribir ninguna fila cuando: `nombre` esté vacío, `email` no tenga formato básico `x@y.z`, `items` esté vacío, o `total` no coincida con la suma de `cantidad × precioUnitario` de los ítems. La validación del total usa los precios informados por el cliente (no se reconsulta `menú` — limitación documentada).

#### Scenario: Email inválido rechazado
- **WHEN** el payload contiene `email` sin formato `x@y.z`
- **THEN** no se agrega ninguna fila y la respuesta es `{ "ok": false, "error": "<mensaje>" }`

#### Scenario: Total incoherente rechazado
- **WHEN** el `total` enviado no equivale a la suma de `cantidad × precioUnitario`
- **THEN** no se agrega ninguna fila y la respuesta es `{ "ok": false, "error": "<mensaje>" }`

### Requirement: Convención de respuesta sin códigos HTTP de error
El `doPost` SHALL responder siempre a nivel HTTP como éxito (a través de la cadena de redirección de Apps Script) y SHALL señalar el resultado en el cuerpo JSON: `ok: true` con `fila` y `timestamp`, o `ok: false` con `error` (mensaje en español, sin exponer stack traces).

#### Scenario: Error interno no filtra detalles
- **WHEN** ocurre una excepción durante el procesamiento (ej. la pestaña `órdenes` no existe)
- **THEN** la respuesta es `{ "ok": false, "error": "<mensaje genérico>" }` y no se filtran stack traces ni rutas internas
