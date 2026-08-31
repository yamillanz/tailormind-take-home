# Delta — menu-page (modificado por cart)

## Purpose

Delta sobre la capacidad `menu-page`: las tarjetas del menú ganan el botón "Agregar" que alimenta al carrito. El resto del comportamiento de la página (fetch en runtime, estados) no cambia.

## MODIFIED Requirements

### Requirement: La página muestra el menú como tarjetas
La página principal SHALL obtener el menú mediante una petición GET en runtime al endpoint de `menu-api` y SHALL renderizar una tarjeta por producto con su `nombre`, `descripcion` y `precio` formateado como entero CLP (es-CL, separador de miles, sin decimales, con símbolo `$`). Cada tarjeta SHALL incluir además un botón "Agregar" que suma 1 unidad del producto al carrito.

#### Scenario: Menú con productos
- **WHEN** el endpoint responde `{ ok: true, items: [ … 6 items … ] }`
- **THEN** la página muestra 6 tarjetas, cada una con nombre, descripción, precio formateado CLP y botón "Agregar"

#### Scenario: Orden y contenido fiel
- **WHEN** el endpoint responde con items en un orden dado
- **THEN** las tarjetas se muestran en el mismo orden y solo con datos del item correspondiente (sin inventar contenido)

#### Scenario: Agregar desde la tarjeta
- **WHEN** el usuario activa el botón "Agregar" de una tarjeta
- **THEN** se agrega 1 unidad de ese producto al carrito según la capacidad `cart`
