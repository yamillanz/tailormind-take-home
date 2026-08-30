# TailorMind Take-Home — Agent Context

App de menú de restaurante con carrito. **Leer `PRD.md` primero** — es la fuente de verdad del proyecto (objetivo, stack fijo, requisitos, reglas y entregables).

## Project

| Capa | Tecnología |
|------|-----------|
| Frontend | Astro (estático, islands para el carrito) |
| Backend / datos | Google Sheets (pestañas `menú` y `órdenes`) |
| Puente | Google Apps Script Web App (`doGet` menú, `doPost` órdenes) |
| Deploy | GitHub Pages (push a `main` → Actions) |

Live: https://yamillanz.github.io/tailormind-take-home/

Diseño: **leer `DESIGN.md` antes de crear UI** — paleta (Tailwind v4, tokens en `src/styles/global.css`), colección de componentes (`src/components/`) y estados obligatorios.

## Hard rules (from PRD.md)

- **No preguntar aclaraciones del spec** — documentar supuestos (README, sección "Supuestos").
- El README debe incluir **el párrafo con los pasos para preparar una pizza** (requisito literal del enunciado).
- `chat.md` en la raíz: transcripción **cruda** de la conversación con el LLM. No pulir ni resumir.
- No agregar contenido al entregable que no venga del enunciado.

## Workflow

- Spec-driven: usar los comandos OpenSpec (`/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive`).
- Commits pequeños y descriptivos; cada push a `main` despliega a Pages.

## Git rules (obligatorio)

- **El humano decide cuándo hacer commit y cuándo hacer push.** Los agentes NUNCA ejecutan `git commit` ni `git push` por iniciativa propia — solo cuando el humano lo pide de forma explícita.
- El agente puede proponer: "listo para commit", con mensaje sugerido. La decisión y el momento son del humano.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

```sh
npm install
npm run dev
npm run build
```

## Documentation

Full Astro documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding client-side scripts (carrito)](https://docs.astro.build/en/guides/client-side-scripts/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Deploying to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
