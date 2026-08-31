# Design — menu-page

## Context

Contrato `menu-api` verificado E2E (GET → `{ok, items}` con `{id,nombre,descripcion,precio}`, errores en cuerpo). Stack fijado: Astro estático + Tailwind v4 (tokens en `global.css`), sin framework JS. Estados de UI y componentes ya definidos en DESIGN.md. Ver proposal.md para el alcance.

## Goals / Non-Goals

**Goals:**
- Página de menú funcional en producción (GitHub Pages) leyendo datos frescos en cada visita.
- Markup de tarjeta con una sola fuente de verdad, estilos 100% via tokens DESIGN.md.

**Non-Goals:**
- Sin botón "Agregar" (llega con el change `cart`), sin categorías, búsqueda, imágenes ni paginación (PRD no las pide; corte de alcance).
- Sin fetch en build-time (descartado por D8 del change anterior: el menú cambia sin redeploy).
- Sin cambios al backend ni a `menu-api`.

## Decisions

### D1 — Fetch en runtime desde el navegador
Vanilla `fetch(MENU_ENDPOINT)` al montar la página. Alineado con D8 (contrato) y con PRD §8 ("el frontend llama a la URL de la Web App"). CORS ya verificado (302 → `ACAO: *`).
*Alternativa build-time:* descartada — congelaría el menú en el deploy.

### D2 — Island vanilla, sin framework
Un solo script TS (`src/scripts/menu.ts`) importado por `index.astro` (Astro lo empaqueta y lo difiere automáticamente). Sin React/Preact/Svelte: el estado es trivial (loading/error/empty/success) y el PRD dice "islands si hace falta".
*Alternativa framework UI:* peso y build extra sin beneficio para una lista de tarjetas.

### D3 — Markup de tarjeta en un helper TS, no en `.astro`
Los datos llegan en runtime, así que `ProductCard.astro` no puede renderizarlas (Astro renderiza en build). El markup vive en `src/scripts/product-card.ts` (`productCardHTML(item)`) usando las mismas clases de DESIGN.md; `DESIGN.md` se actualiza para apuntar al helper. Una sola fuente de verdad del markup.
*Alternativa duplicar markup (.astro + template JS):* dos lugares que divergen — descartado.

### D4 — Endpoint en `src/config.ts`
`export const MENU_ENDPOINT = "…/exec"` (URL ya registrada en `apps-script/README.md`). Público por diseño (supuesto #7); evita plomería de env vars en el workflow de Pages. Un solo lugar para cambiarlo.

### D5 — Formato de precio: `Intl.NumberFormat`
`new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })` → `$9.900`. Consistente con supuesto CLP-enteros; sin formateo manual a mano.

### D6 — Máquina de estados explícita
`loading → success | empty | error`, con `error` reingresable a `loading` vía "Reintentar" (misma función de fetch). Los tres estados no-success reemplazan el contenedor completo (sin contenido parcial). Skeletons en `loading` (nada de spinners), `Alert` según variante en `empty`/`error` — tal como DESIGN.md manda.

### D7 — Accesibilidad mínima
Contenedor de mensajes con `role="status"` (anuncia vacío/error), botón "Reintentar" con texto real, jerarquía `h1` en la página. Sin imágenes, no hay `alt` que gestionar.

## Risks / Trade-offs

- [Endpoint caído o lento] → estado de error con reintento es el comportamiento spec'd; el sitio estático sigue arriba.
- [Contenido renderizado solo con JS] → asumido en un menú con precios dinámicos; el PRD no exige SSR ni SEO de productos.
- [`ok:false` por mala configuración del Sheet visible al usuario] → mensaje de error genérico; el detalle queda en logs del dueño (el script no filtra stack).

## Migration Plan

Todo es archivo nuevo + reemplazo del placeholder `index.astro`. Rollback: revert del commit; el endpoint y el Sheet no se tocan.

## Open Questions

Ninguna.
