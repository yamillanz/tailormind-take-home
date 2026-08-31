# DESIGN.md — Sistema de diseño (mínimo viable)

Objetivo: **consistencia UX/UI con el menor esfuerzo posible**. Nada de librerías de UI ni JS de framework: **Tailwind v4 + componentes Astro puros**. Este documento es la referencia obligatoria para cualquier UI nueva.

## Decisiones

| Decisión | Elección | Motivo |
|----------|----------|--------|
| Estilos | Tailwind v4 (ya instalado, tokens en `src/styles/global.css`) | Velocidad + consistencia por tokens |
| Componentes | Astro components en `src/components/` | Cero JS salvo islands del carrito |
| Neutrales | `stone` (default Tailwind) | Base cálida, apropiada para comida |
| Prohibido | hex/valores inline fuera de `global.css` | Un solo lugar de verdad para la paleta |

## Paleta

Custom ramp único: **brand (tomate)** — definido en `src/styles/global.css` con `@theme`. Todo lo demás son defaults de Tailwind.

| Token | Uso |
|-------|-----|
| `brand-500` #e63946 | Primario: botones "Agregar", CTAs, enlaces activos |
| `brand-600` | Hover del primario; error semántico |
| `brand-700` | Active/pressed del primario |
| `brand-50`–`brand-200` | Fondos suaves de badges/alertas |
| `amber-500`/`amber-600` | Acento: precios y totales |
| `stone-50` / `stone-900` | Fondo de página / texto principal |
| `stone-400`–`stone-600` | Texto secundario, bordes, placeholders |
| `green-600` | Éxito (orden enviada) |
| `sky-600` | Info |

Contraste: texto `stone-900`/`stone-600` sobre `stone-50` cumple AA. Blanco sobre `brand-500` cumple AA para texto ≥ 14px bold.

## Tipografía

System stack (default de Tailwind, cero dependencias). Escala default:

- `text-3xl font-bold` — título de página
- `text-xl font-semibold` — nombre de producto
- `text-base` / `text-sm text-stone-600` — cuerpo / descripción
- `text-sm font-medium` — labels de formulario

## Forma

- Cards: `rounded-xl border border-stone-200 bg-white shadow-sm`
- Botones e inputs: `rounded-lg`
- Radios y sombras solo de la escala default de Tailwind; sin sombras custom.

## Colección de componentes (`src/components/`)

Crear a medida que se implementan los changes OpenSpec; si un componente falta, crearlo aquí antes de estilizar ad-hoc.

| Componente | Variantes / props | Uso |
|------------|-------------------|-----|
| `Button.astro` | `variant: primary \| secondary \| ghost`, `size: sm \| md` | primary = `bg-brand-500 text-white hover:bg-brand-600`; secondary = `border border-stone-300 bg-white hover:bg-stone-100`; ghost = `text-brand-600 hover:bg-brand-50` |
| `ProductCard.astro` → `src/scripts/product-card.ts` | `productCardHTML(item)` | Tarjeta del menú (sección 3.2 del PRD). Helper TS client-side: los datos llegan en runtime, no en build. El botón "Agregar" llega con el change `cart` |
| `QuantityStepper.astro` | `cantidad`, eventos client-side | − / cantidad / + en carrito |
| `CartSummary.astro` | items + subtotales + total | Resumen lateral/fijo; botón "Enviar orden" (primary) |
| `Badge.astro` | `variant: success \| warning \| error` | Estados pequeños (ej. "agotado") |
| `FieldInput.astro` | `label, name, type` | Inputs de nombre/email en checkout; estilo compartido |
| `Alert.astro` | `variant: error \| success \| info` | Mensajes de carga/fallo/éxito |
| `Skeleton.astro` | `lines` | Placeholder mientras carga el menú |

## Estados de UI (obligatorios para el menú y el carrito)

| Estado | Tratamiento |
|--------|-------------|
| Loading | `Skeleton` (no spinners) |
| Error de fetch | `Alert` variant error con acción "Reintentar" |
| Menú vacío | `Alert` variant info: "No hay productos disponibles" |
| Enviando orden | Botón en estado disabled + texto "Enviando…" |
| Orden enviada | `Alert` success + vaciar carrito |

## Accesibilidad

- Contraste AA mínimo (ver paleta).
- `focus-visible:ring-2 focus-visible:ring-brand-500` en todo elemento interactivo.
- Carrito: `aria-live="polite"` en el total para anunciar cambios.
- Botones con texto siempre; si hay solo icono (stepper), `aria-label`.

## Reglas rápidas

1. ¿Color nuevo? → token en `global.css` + entrada aquí. Nunca inline.
2. ¿JS? → solo island del carrito; el resto HTML/CSS estático.
3. ¿Componente nuevo? → tabla de arriba primero; si no existe, agregarlo a esta lista.
4. Layout de página: `mx-auto max-w-5xl px-4 py-8` (ver `src/pages/index.astro`).
