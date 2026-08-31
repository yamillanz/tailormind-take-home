/**
 * TailorMind Take-Home — Puente Google Sheets ⇄ Web App
 *
 * Contrato (openspec/changes/menu-orders-contract/specs/):
 *   doGet  → { ok: true, items: [{ id, nombre, descripcion, precio }] }
 *            (solo filas con disponible = TRUE; pestaña vacía → items: [])
 *   doPost → payload { cliente: { nombre, email }, items: [{ id, nombre, cantidad, precioUnitario }], total }
 *            → agrega fila a "órdenes": [timestamp(server ISO), nombre, email, items(JSON), total]
 *            → { ok: true, fila, timestamp } | { ok: false, error }
 *
 * Errores SIEMPRE en el cuerpo (Apps Script no puede fijar códigos HTTP).
 * Tras editar este archivo: Deploy → Manage deployments → edit → New version.
 */

var SHEET_MENU = 'menú';
var SHEET_ORDENES = 'órdenes';
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_MENU);
  if (!sheet) {
    return json_({ ok: false, error: 'Configuración: no existe la pestaña "' + SHEET_MENU + '"' });
  }
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return json_({ ok: true, items: [] });
  }
  var values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  var items = [];
  values.forEach(function (row) {
    var id = String(row[0]).trim();
    var disponible = row[4] === true || String(row[4]).trim().toUpperCase() === 'TRUE';
    if (!id || !disponible) {
      return;
    }
    items.push({
      id: id,
      nombre: String(row[1]).trim(),
      descripcion: String(row[2]).trim(),
      precio: Number(row[3]) || 0
    });
  });
  return json_({ ok: true, items: items });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var error = validar_(payload);
    if (error) {
      return json_({ ok: false, error: error });
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ORDENES);
    if (!sheet) {
      return json_({ ok: false, error: 'Configuración: no existe la pestaña "' + SHEET_ORDENES + '"' });
    }
    var totalCalculado = payload.items.reduce(function (sum, item) {
      return sum + Number(item.cantidad) * Number(item.precioUnitario);
    }, 0);
    if (Number(payload.total) !== totalCalculado) {
      return json_({ ok: false, error: 'El total no coincide con la suma de los items' });
    }
    var timestamp = new Date().toISOString();
    sheet.appendRow([
      timestamp,
      String(payload.cliente.nombre).trim(),
      String(payload.cliente.email).trim(),
      JSON.stringify(payload.items),
      totalCalculado
    ]);
    return json_({ ok: true, fila: sheet.getLastRow(), timestamp: timestamp });
  } catch (err) {
    return json_({ ok: false, error: 'No se pudo procesar la orden' });
  }
}

function validar_(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Payload inválido';
  }
  var cliente = payload.cliente;
  if (!cliente || typeof cliente !== 'object') {
    return 'Faltan los datos del cliente';
  }
  if (!String(cliente.nombre || '').trim()) {
    return 'El nombre del cliente es obligatorio';
  }
  if (!EMAIL_RE.test(String(cliente.email || ''))) {
    return 'Email inválido (ejemplo: nombre@dominio.cl)';
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return 'La orden no tiene items';
  }
  for (var i = 0; i < payload.items.length; i++) {
    var item = payload.items[i];
    var cantidad = Number(item.cantidad);
    var precio = Number(item.precioUnitario);
    if (!String(item.id || '').trim() || !String(item.nombre || '').trim() ||
        !Number.isInteger(cantidad) || cantidad < 1 || !isFinite(precio) || precio < 0) {
      return 'Cada item requiere id, nombre, cantidad y precioUnitario válidos';
    }
  }
  return null;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
