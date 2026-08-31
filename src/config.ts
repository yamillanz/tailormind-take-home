/**
 * Endpoint del Web App de Apps Script (público por diseño — ver supuestos del README).
 * Fuente de verdad del URL: apps-script/README.md
 */
export const MENU_ENDPOINT =
	'https://script.google.com/macros/s/AKfycbxTZG5kuL3n0jMFEKtx8ifMzafb8qK_wijdDP5kvNlEoZ5dHvgABGyRRgkqqaiFgH7sXg/exec';

/** doGet y doPost viven en el mismo Web App: el POST de órdenes usa el mismo URL. */
export const ORDER_ENDPOINT = MENU_ENDPOINT;
