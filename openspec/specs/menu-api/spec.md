# menu-api — Especificación

## Purpose

Servir el menú del restaurant (pestaña `menú` de Google Sheets) como JSON vía Apps Script `doGet`, para que el frontend estático lo consuma en runtime con un `fetch` estándar.

## Requirements

### Requirement: El endpoint expone el menú como JSON
El `doGet` del Web App SHALL responder a cualquier petición GET pública con JSON de la forma `{ "ok": true, "items": [...] }`, donde cada elemento contiene exactamente `id` (string), `nombre` (string), `descripcion` (string) y `precio` (number, entero CLP sin decimales).

#### Scenario: Petición GET exitosa
- **WHEN** se hace GET al URL `/exec` del Web App desplegado
- **THEN** la respuesta es JSON válido con `ok: true` y `items` como arreglo (posiblemente vacío), cada ítem con `id`, `nombre`, `descripcion`, `precio`

### Requirement: Solo productos disponibles
El `doGet` SHALL incluir únicamente las filas de `menú` cuyo campo `disponible` sea TRUE, preservando el orden de las filas del Sheet.

#### Scenario: Fila no disponible excluida
- **WHEN** la pestaña `menú` contiene una fila con `disponible = FALSE`
- **THEN** esa fila no aparece en `items` de la respuesta

### Requirement: Degradación controlada ante Sheet vacío o mal configurado
El `doGet` SHALL responder con `{ "ok": true, "items": [] }` cuando la pestaña `menú` existe pero no tiene filas de datos (estado vacío, no error), y SHALL responder con `{ "ok": false, "error": "<mensaje>" }` cuando la pestaña `menú` no existe en el Sheet (error de configuración).

#### Scenario: Menú vacío
- **WHEN** la pestaña `menú` no tiene filas de datos
- **THEN** la respuesta es `{ "ok": true, "items": [] }`

#### Scenario: Pestaña faltante
- **WHEN** la pestaña `menú` no existe en el Sheet
- **THEN** la respuesta es `{ "ok": false, "error": "<mensaje>" }`
