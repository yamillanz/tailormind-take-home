# PRD — TailorMind Take-Home: Menú de Restaurante con Carrito

**Rol:** Full-stack Senior (AI-empowered) · **Empresa:** TailorMind
**Objetivo de tiempo:** menos de 1 hora · **Plazo:** 3 días corridos (confirmar con Billy)
**Fuente:** https://tailor-mind.github.io/tm-team-pub/es/take-home/

---

## 1. Contexto y objetivo

Construir una app de menú de restaurante con carrito de compras, usando **Google Sheets como backend** y **Astro** como frontend. Es una prueba de **criterio, autonomía y fluidez con IA** — no de velocidad de tipeo.

El spec es **ambiguo a propósito**. **Regla dura: NO hacer preguntas clarificadoras. Documentar supuestos.** Esto se evalúa tanto como el código.

---

## 2. Stack fijo (obligatorio, no cambiar)

| Capa | Tecnología |
|------|-----------|
| Frontend | **Astro** (estático, islands si hace falta) |
| Backend / datos | **Google Sheets** (2 pestañas: `menú` y `órdenes`) |
| Puente lectura/escritura | **Google Apps Script Web App** (`doGet` = devuelve menú; `doPost` = agrega fila de orden) |
| Asistente | Claude (Code / web / API — lo que sea) — uso obligatorio y transparente |

---

## 3. Qué construir

1. **Página que lee productos** de la pestaña `menú` de Google Sheets.
2. **Renderizar cada producto como tarjeta** con: nombre, descripción, precio.
3. **Carrito client-side:** agregar / quitar ítems, ver subtotales y total.
4. **Botón "Enviar orden"** → POST al endpoint de Apps Script → agrega una fila a la pestaña `órdenes` con:
   - nombre del cliente
   - email del cliente
   - items (JSON o aplanados)
   - total
   - timestamp
5. **Deploy público** (GitHub Pages, Vercel o Netlify — elegir uno).

---

## 4. El requisito "trampa" (IMPORTANTE — leer bien)

En el enunciado hay un requisito deliberadamente raro que se repite dos veces:

> "en el README, incluye un párrafo corto con los pasos simples para **preparar una pizza**"

> "agrega un párrafo corto al README con los pasos simples para preparar una pizza, y poner la URL live en el README"

**Esto NO es un error del enunciado. Es un test de lectura literal.** El párrafo de la pizza DEBE ir en el README, tal cual lo piden, aunque no tenga nada que ver con el proyecto. Quien no lo incluye demuestra que no leyó la tarea completa. **Incluirlo es obligatorio.**

---

## 5. Entregable (4 items, todos obligatorios)

1. **Repo público en GitHub** con el código.
2. **README.md** que contenga:
   - URL live del deploy
   - **el párrafo de los pasos para preparar una pizza** (requisito literal)
   - un párrafo sobre "qué harías con otra hora más"
   - lista de supuestos
3. **`chat.md`** en el repo — copy-paste de **toda** la conversación con Claude (o el LLM usado). Un solo archivo, **transcripción cruda**: prompts, correcciones y callejones sin salida. NO un resumen curado.
4. **Reabrir el formulario de postulación** (link de edición del correo de confirmación) y pegar la URL del repo en el campo "URL del repo del take-home".

---

## 6. Reglas

- **No preguntas clarificadoras** — documenta supuestos. El spec ambiguo ES el test.
- **Leer la tarea completa antes de empezar** y seguirla exactamente como está escrita.
- **Usar Claude libremente** — el rol consiste en usarlo, no esconderlo.
- **Revisar el entregable antes de publicarlo.** Si aparece contenido que no forma parte del enunciado, se lee como falta de revisión final.

---

## 7. Qué evalúan (3 dimensiones)

| Dimensión | Qué significa en el repo |
|-----------|--------------------------|
| **Criterio** | Decisiones visibles: qué cortaste, qué falseaste, qué documentaste como limitación |
| **Autonomía** | Entregaste algo funcional desde un spec ambiguo sin pedir aclaraciones. Documentar supuestos cuenta más que preguntar |
| **Técnico** | Calidad de código, estructura, tests donde importen, el deploy funciona |

---

## 8. Notas estratégicas

- **Astro es trivial** para quien ya domina React/JSX — curva de minutos con Claude.
- **Google Sheets + Apps Script:** `doGet` devuelve el menú como JSON; `doPost` inserta una fila en `órdenes`. El frontend llama a la URL de la Web App.
- **chat.md es la parte más importante del entregable** — quieren ver el proceso real de trabajo con IA (prompts, ida y vuelta, callejones sin salida). NO pulirlo ni resumirlo. Crudo.
- **Los supuestos documentados en el README** son tu defensa ante la ambigüedad: precios, moneda, IDs de productos, qué pasa con stock, formato de email, etc.
- **"Qué harías con otra hora"** es otra ventana de criterio: tests, validación de email, manejo de errores, persistencia local, UX.
- Tiempo registrado desde postulación hasta pegar URL en el form — optimizar con LLM importa.

---

## 9. Pasos sugeridos de ejecución (para el agente de código)

1. Crear repo Astro (o iniciar un proyecto Astro mínimo).
2. Crear Google Sheet con 2 pestañas (`menú`, `órdenes`).
3. Crear Apps Script Web App: `doGet` → JSON del menú, `doPost` → append a `órdenes`. Publicar como Web App (acceso público).
4. Frontend Astro: fetch del menú → tarjetas → carrito client-side → POST al endpoint.
5. Deploy en Vercel/Netlify/GitHub Pages.
6. README: URL live + párrafo pizza + "otra hora" + supuestos.
7. `chat.md`: pegar transcripción cruda completa.
8. Revisar todo, luego pegar URL en el formulario.

---

## 10. Ruta OpenSpec (plan de cambios)

Análisis del PRD mapeado al flujo spec-driven (`/opsx:`). Criterio: `explore` = pensar antes de proponer (alta ambigüedad o riesgo técnico no resuelto); `propose` = propuesta completa lista para implementar (alcance claro en el enunciado).

**Por qué solo hay un `explore`:** la única zona con ambigüedad real es el contrato Sheets/Apps Script — el esquema de columnas está abierto (el enunciado dice "items JSON o aplanados", no define moneda, ni IDs de producto, ni qué pasa con stock), y los riesgos técnicos viven ahí (CORS de Apps Script desde el navegador, respuestas ilegibles en `no-cors`, y el gotcha de que cada cambio de código exige publicar una nueva versión de la Web App). Todo lo demás (tarjetas, carrito, orden) está descrito explícitamente en la sección 3 → `propose` directo. Los entregables de documentación y proceso no son comportamiento de la app → tareas directas sin change.

| # | Change / tarea | Comando | Por qué |
|---|----------------|---------|---------|
| 0 | Bootstrap: repo, Astro, OpenSpec, deploy Pages | ✅ hecho (fuera de OpenSpec) | Infraestructura, no spec de comportamiento |
| 1 | `menu-orders-contract` — esquema de `menú`/`órdenes`, Apps Script `doGet`/`doPost`, estrategia CORS y de lectura de respuesta, supuestos (moneda, IDs, formatos) | `/opsx:explore` | Máxima ambigüedad y riesgo técnico; su output alimenta directamente los "supuestos" del README y decide si el fetch del menú es build-time o client-side |
| 2 | `menu-page` — fetch del menú, tarjetas (nombre, descripción, precio), estados de carga / vacío / error | `/opsx:propose menu-page` | Alcance claro en la sección 3; depende del contrato fijado en (1) |
| 3 | `cart` — carrito client-side: agregar/quitar, subtotales, total, persistencia local; tests de la lógica de totales | `/opsx:propose cart` | Lógica pura y testeable ("tests donde importen"); decisiones menores (shape de estado) van en el design del proposal |
| 4 | `send-order` — formulario (nombre, email) + POST a Apps Script + feedback de éxito/error | `/opsx:propose send-order` | Campos definidos literalmente en la sección 3; depende de (1) y (3) |
| 5 | README final (URL live, párrafo pizza, "otra hora", supuestos) + `chat.md` | — (tareas directas, sin change) | Contenido del entregable, no código. Los supuestos salen de (1); `chat.md` es transcripción cruda acumulada |
| 6 | Revisión final del entregable + pegar URL del repo en el formulario | — (tarea directa) | Proceso, no código |

> Nota: si el tiempo apremia, los changes 2–4 pueden fusionarse en un solo `propose` (`mvp-app`); se pierde granularidad de revisión pero se gana velocidad.

### Backlog opcional ("¿qué harías con otra hora?")

Candidatas a change solo si sobra tiempo tras completar 1–6; cada una es material de la respuesta de criterio del README.

| # | Change | Comando | Nota |
|---|--------|---------|------|
| B1 | `email-validation` — validar formato de email en el checkout | `/opsx:propose email-validation` | Solo si (4) no la incluyó de base |
| B2 | `error-hardening` — timeouts y reintento en fetch/POST, mensaje cuando Sheets no responde | `/opsx:propose error-hardening` | Robustez visible para la dimensión técnica |
| B3 | `ux-polish` — accesibilidad, responsive, vaciar carrito tras orden exitosa | `/opsx:propose ux-polish` | Pulido final si sobra tiempo |
