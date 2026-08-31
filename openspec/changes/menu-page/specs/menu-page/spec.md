# Delta — menu-page

## Purpose

Página pública que muestra el menú del restaurant en tarjetas (nombre, descripción, precio), consumiendo la capacidad `menu-api` en runtime desde el navegador, con estados de carga, vacío y error.

## ADDED Requirements

### Requirement: La página muestra el menú como tarjetas
La página principal SHALL obtener el menú mediante una petición GET en runtime al endpoint de `menu-api` y SHALL renderizar una tarjeta por producto con su `nombre`, `descripcion` y `precio` formateado como entero CLP (es-CL, separador de miles, sin decimales, con símbolo `$`).

#### Scenario: Menú con productos
- **WHEN** el endpoint responde `{ ok: true, items: [ … 6 items … ] }`
- **THEN** la página muestra 6 tarjetas, cada una con nombre, descripción y precio formateado CLP del producto

#### Scenario: Orden y contenido fiel
- **WHEN** el endpoint responde con items en un orden dado
- **THEN** las tarjetas se muestran en el mismo orden y solo con datos del item correspondiente (sin inventar contenido)

### Requirement: Estado de carga mientras llega la respuesta
Mientras el fetch está en vuelo, la página SHALL mostrar skeletons (placeholders con la forma de tarjetas) y no SHALL mostrar un spinner ni contenido parcial.

#### Scenario: Carga en progreso
- **WHEN** la petición al endpoint no ha terminado
- **THEN** la página muestra placeholders con la forma de tarjetas

### Requirement: Estado vacío
Cuando el endpoint responde `ok: true` con `items` vacío, la página SHALL mostrar un mensaje informativo "No hay productos disponibles" en lugar de tarjetas.

#### Scenario: Menú sin productos
- **WHEN** el endpoint responde `{ ok: true, items: [] }`
- **THEN** la página muestra el mensaje informativo y ninguna tarjeta

### Requirement: Estado de error con reintento
Si el fetch falla (red) o la respuesta es `ok: false`, la página SHALL mostrar un mensaje de error con un botón "Reintentar" que repite la petición; el estado SHALL volver a carga (skeletons) durante el reintento.

#### Scenario: Fallo de red
- **WHEN** la petición falla por red o el endpoint responde `ok: false`
- **THEN** la página muestra un mensaje de error con botón "Reintentar" y ninguna tarjeta

#### Scenario: Reintento exitoso
- **WHEN** el usuario activa "Reintentar" y la nueva petición responde `ok: true` con items
- **THEN** los skeletons aparecen durante el reintento y luego se muestran las tarjetas
