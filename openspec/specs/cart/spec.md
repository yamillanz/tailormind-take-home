# cart — Especificación

## Purpose

Carrito client-side: agregar/quitar ítems desde el menú, cantidades con stepper, subtotales por línea, total formateado, persistencia local y reconciliación con el menú vigente.

## Requirements

### Requirement: Agregar productos desde el menú
Cada tarjeta del menú SHALL incluir un botón "Agregar" que suma 1 unidad de ese producto al carrito; si el producto ya está en el carrito, SHALL incrementar su cantidad en 1 respetando el máximo.

#### Scenario: Producto nuevo
- **WHEN** el usuario activa "Agregar" en la tarjeta de un producto que no está en el carrito
- **THEN** el carrito muestra una línea nueva con cantidad 1 y el total aumenta en el precio del producto

#### Scenario: Producto existente
- **WHEN** el usuario activa "Agregar" en la tarjeta de un producto que ya tiene una línea en el carrito
- **THEN** la cantidad de esa línea aumenta en 1 (sin crear línea duplicada) y el total se actualiza

### Requirement: Líneas del carrito con stepper y subtotal
Cada línea del carrito SHALL mostrar nombre, precio unitario, un stepper − / cantidad / + y el subtotal de la línea (cantidad × precio unitario, CLP). El stepper SHALL decrementar con mínimo 1 y incrementar con máximo 99; quitar la línea SHALL ser una acción explícita e independiente del stepper.

#### Scenario: Cambio de cantidad actualiza subtotal y total
- **WHEN** el usuario incrementa o decrementa la cantidad de una línea dentro de los límites
- **THEN** el subtotal de esa línea y el total del carrito se recalculan al vuelo

#### Scenario: Límites del stepper
- **WHEN** una línea tiene cantidad 1 y el usuario activa "−", o cantidad 99 y activa "+"
- **THEN** la cantidad no cambia por debajo de 1 ni por encima de 99

#### Scenario: Quitar línea
- **WHEN** el usuario quita una línea del carrito
- **THEN** la línea desaparece y el total se recalcula sin ella

### Requirement: Total del carrito
El carrito SHALL mostrar el total = Σ (cantidad × precio unitario) de todas las líneas, formateado CLP, en un contenedor con `aria-live="polite"` para que los lectores de pantalla anuncien los cambios.

#### Scenario: Total coherente
- **WHEN** hay líneas con cantidades y precios vigentes
- **THEN** el total mostrado es la suma exacta de los subtotales de las líneas

### Requirement: Persistencia local
El carrito SHALL persistir en localStorage guardando únicamente pares `{ id, cantidad }` (nunca precios ni nombres) y SHALL restaurarse al recargar la página; los precios y nombres de las líneas restauradas SHALL resolverse contra el menú vigente en el momento del render.

#### Scenario: Sobrevive la recarga
- **WHEN** hay productos en el carrito y el usuario recarga la página
- **THEN** el carrito reaparece con las mismas líneas y cantidades, con los precios del menú vigente

#### Scenario: No persiste precios
- **WHEN** se inspecciona el localStorage tras agregar productos
- **THEN** contiene pares `{ id, cantidad }` y ningún precio ni nombre

### Requirement: Reconciliación con el menú vigente
Al hidratar el carrito, las líneas cuyo `id` no exista en el menú disponible actual SHALL descartarse silenciosamente.

#### Scenario: Producto ya no disponible
- **WHEN** el localStorage contiene una línea con un `id` que el menú ya no reporta
- **THEN** esa línea no aparece en el carrito restaurado y el total la ignora

### Requirement: Carrito vacío
Cuando no hay líneas, el carrito SHALL mostrar un mensaje informativo de carrito vacío en lugar de líneas y total.

#### Scenario: Sin líneas
- **WHEN** el carrito no tiene líneas (o se quitaron todas)
- **THEN** se muestra el mensaje de carrito vacío y no se muestra total
