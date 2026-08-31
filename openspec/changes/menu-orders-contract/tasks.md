# Tasks — menu-orders-contract

## 1. Sheet: estructura y datos semilla

- [x] 1.1 Crear/renombrar las dos pestañas exactamente como `menú` y `órdenes` (con acento) en el Sheet existente; verificar que los nombres no tienen espacios
- [x] 1.2 Escribir encabezados de `menú` (`id`, `nombre`, `descripcion`, `precio`, `disponible`) y cargar 4–6 productos de ejemplo chilenos con `precio` entero (CLP) y `disponible` TRUE/FALSE mixto; verificación visual: encabezados y tipos correctos
- [x] 1.3 Escribir encabezados de `órdenes` (`timestamp`, `nombre_cliente`, `email_cliente`, `items`, `total`); verificación visual: fila 1 completa
- [x] 1.4 Confirmar sharing del Sheet en viewer/privado (solo el humano edita); verificación: abrir el link en navegador anónimo no permite editar

## 2. Apps Script: `Code.gs`

- [x] 2.1 Crear `apps-script/Code.gs` en el repo con: constantes de nombres de pestañas, `doGet` (lee `menú`, filtra `disponible=TRUE`, mapea a `{id,nombre,descripcion,precio}`, responde `{ok:true,items}`; pestaña faltante → `{ok:false,error}`); verificación: revisión de código contra specs/menu-api escenario por escenario
- [x] 2.2 Implementar en `Code.gs` el `doPost`: `JSON.parse(e.postData.contents)`, validaciones (nombre no vacío, email `x@y.z`, items no vacío, `total == Σ cantidad×precioUnitario`), append a `órdenes` con timestamp server-side ISO, respuestas `{ok:true,fila,timestamp}` / `{ok:false,error}` y try/catch con mensaje genérico; verificación: revisión de código contra specs/orders-api escenario por escenario
- [x] 2.3 Copiar `Code.gs` al editor de Apps Script (Extensions → Apps Script en el Sheet), guardar y autorizar permisos; verificación: sin errores al guardar y autorización concedida con la cuenta del humano

## 3. Deploy y verificación del contrato (E2E manual)

- [x] 3.1 Desplegar como Web App: Execute as **me**, Who has access **Anyone**; copiar URL `/exec`; verificación: URL obtenido y guardado (también anotar ID de despliegue)
- [x] 3.2 Verificar GET con curl: `curl -sL "<URL>" | python3 -m json.tool` devuelve `{ok:true, items:[...]}` con solo los disponibles; verificación: salida JSON válida y filtrado correcto
- [x] 3.3 Verificar POST con curl (Content-Type text/plain, payload válido): respuesta `{ok:true,fila,timestamp}` y nueva fila en `órdenes` con timestamp ISO server-side; verificación: fila visible en el Sheet
- [x] 3.4 Verificar rechazos con curl: email inválido, items vacío y total incoherente → `{ok:false,error}` y cero filas nuevas; verificación: 3 respuestas ok:false y `órdenes` sin cambios
- [x] 3.5 Verificar gotcha de redeploy: editar un comentario en `Code.gs`, republicar versión nueva (Manage deployments → New version) y re-ejecutar 3.2; verificación: `/exec` refleja el cambio
- [x] 3.6 Registrar el URL `/exec` como constante de cara a cambios futuros (nota en `apps-script/README.md` o comentario del repo, sin hardcodearlo aún en el frontend); verificación: archivo/nota existe

## 4. Documentación

- [x] 4.1 Escribir `apps-script/README.md`: cómo pegar el script, cómo desplegar, cómo republicar versión, cómo probar con curl (GET/POST ejemplos); verificación: instrucciones reproducibles paso a paso
- [x] 4.2 Redactar los supuestos nacidos de este change (CLP entero, IDs slug, sin stock cuantitativo, POST siempre 200, sheet owner-only, URL público) como lista lista para pegar en README raíz; verificación: lista revisada por el humano
