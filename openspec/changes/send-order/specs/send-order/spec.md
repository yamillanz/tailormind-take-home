# Delta — send-order

## Purpose

Checkout del carrito: formulario (nombre, email), envío de la orden por POST al endpoint según el contrato `orders-api`, y feedback de éxito/error al usuario.

## ADDED Requirements

### Requirement: Formulario de checkout en el carrito
Cuando el carrito tiene líneas, el panel SHALL mostrar un formulario con los campos "Nombre" (obligatorio) y "Email" (obligatorio, formato email) y el botón "Enviar orden"; el formulario SHALL validarse con validación HTML5 antes de permitir el envío.

#### Scenario: Formulario visible con carrito poblado
- **WHEN** el carrito tiene al menos una línea
- **THEN** el panel muestra los campos Nombre y Email y el botón "Enviar orden"

#### Scenario: Validación bloquea envío vacío
- **WHEN** el usuario intenta enviar sin nombre o con email sin formato válido
- **THEN** el navegador bloquea el envío (validación HTML5) y no se realiza ninguna petición

### Requirement: Envío de la orden según el contrato
Al enviar el formulario con datos válidos, el frontend SHALL hacer POST al endpoint con `Content-Type: text/plain;charset=utf-8` y el cuerpo JSON `{ "cliente": { "nombre", "email" }, "items": [ { "id", "nombre", "cantidad", "precioUnitario" } ], "total" }`, donde `items` y `total` se construyen desde las líneas del carrito y el menú vigente (total = Σ cantidad × precioUnitario). Mientras la petición está en vuelo, el botón SHALL deshabilitarse con el texto "Enviando…", impidiendo el doble envío.

#### Scenario: Payload coherente
- **WHEN** se envía una orden con líneas y precios vigentes
- **THEN** el cuerpo del POST contiene exactamente los items del carrito (id, nombre, cantidad, precioUnitario) y `total` igual a la suma de cantidad × precioUnitario

#### Scenario: Sin doble envío
- **WHEN** la petición está en vuelo
- **THEN** el botón está deshabilitado ("Enviando…") y nuevos envíos son imposibles hasta que responda

### Requirement: Feedback de éxito
Si la respuesta es `ok: true`, el panel SHALL mostrar una confirmación de éxito (Alert success) que incluya el número de fila asignado, SHALL vaciar el carrito (memoria y localStorage) y SHALL resetear el formulario.

#### Scenario: Orden aceptada
- **WHEN** el endpoint responde `{ ok: true, fila: N, timestamp: … }`
- **THEN** se muestra la confirmación con la fila N, el carrito queda vacío (localStorage incluido) y el formulario se resetea

### Requirement: Feedback de error sin perder el carrito
Si la respuesta es `ok: false` o la petición falla por red, el panel SHALL mostrar un mensaje de error (el mensaje del servidor en el primer caso, uno genérico en el segundo), SHALL mantener el carrito y los datos del formulario intactos, y SHALL re-habilitar el botón para reintentar.

#### Scenario: Rechazo del servidor
- **WHEN** el endpoint responde `{ ok: false, error: "…" }` (ej. email inválido)
- **THEN** se muestra ese mensaje como Alert error, el carrito y el formulario permanecen como estaban y el botón vuelve a habilitarse

#### Scenario: Fallo de red
- **WHEN** la petición falla por red
- **THEN** se muestra un mensaje de error genérico y el botón vuelve a habilitarse
