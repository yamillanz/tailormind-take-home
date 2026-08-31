# apps-script — Puente Google Sheets ⇄ Web App

`Code.gs` de este directorio es la **fuente de verdad** del script. El editor web de Apps Script es solo el runtime.

## Configuración registrada (para cambios futuros)

| Dato | Valor |
|------|-------|
| Sheet ID | `1LiSljwBQH2IsHa9zsEiJlZ184SKTHRP8k8W66_e9C7I` |
| Deployment ID | `AKfycbxTZG5kuL3n0jMFEKtx8ifMzafb8qK_wijdDP5kvNlEoZ5dHvgABGyRRgkqqaiFgH7sXg` |
| URL `/exec` | `https://script.google.com/macros/s/AKfycbxTZG5kuL3n0jMFEKtx8ifMzafb8qK_wijdDP5kvNlEoZ5dHvgABGyRRgkqqaiFgH7sXg/exec` |

> El frontend consumirá este URL en cambios posteriores (no hardcodeado aún). Nota curl: con `curl -L -X POST` curl re-envía POST al host de contenido y Google lo rechaza; usar `--data` sin `-X` (mismo comportamiento que `fetch` en el navegador).

## Instalación (una vez)

1. Abrir el Google Sheet → **Extensions → Apps Script**.
2. Borrar el contenido de `Code.gs` y pegar el archivo `Code.gs` de este directorio.
3. **Save** y ejecutar cualquier función desde el editor para disparar el diálogo de autorización; conceder permisos con la cuenta propietaria del Sheet.

## Deploy

1. **Deploy → New deployment**.
2. Tipo: **Web app**.
3. **Execute as: Me** (cuenta propietaria) · **Who has access: Anyone**.
4. Copiar el URL `/exec` — es el único endpoint que consume el frontend.

## IMPORTANTE: republicar tras cada cambio

Editar `Code.gs` **no** cambia el URL `/exec` hasta publicar una versión nueva:

> **Deploy → Manage deployments → ✏️ (edit) → Version: New version → Deploy**

El URL no cambia entre versiones (siempre es el mismo `/exec`). Sin este paso, el endpoint sigue sirviendo el código anterior.

## Probar con curl

```sh
# GET menú
curl -sL "URL_EXEC" | python3 -m json.tool

# POST orden válida (Content-Type text/plain para evitar preflight CORS)
curl -sL -X POST "URL_EXEC" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"cliente":{"nombre":"Prueba","email":"prueba@example.com"},"items":[{"id":"pizza-margarita","nombre":"Pizza Margarita","cantidad":2,"precioUnitario":9900}],"total":19800}'

# POST rechazado (total incoherente) → {"ok": false, "error": "..."}
curl -sL -X POST "URL_EXEC" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"cliente":{"nombre":"Prueba","email":"prueba@example.com"},"items":[{"id":"x","nombre":"X","cantidad":1,"precioUnitario":1000}],"total":9999}'
```

Ver también los escenarios de prueba en `openspec/changes/menu-orders-contract/specs/`.
