import {
	agregar,
	cambiarCantidad,
	parsear,
	quitar,
	reconciliar,
	serializar,
	type CartLine,
	type PrecioMap,
} from './cart-logic';
import { cartSummaryHTML, type CartItemNombre } from './cart-ui';
import type { MenuItem } from './product-card';

const STORAGE_KEY = 'tailormind-cart-v1';

let lines: CartLine[] = [];
let nombres: Record<string, string> = {};
let precios: PrecioMap = {};

function persistir(): void {
	try {
		localStorage.setItem(STORAGE_KEY, serializar(lines));
	} catch {
		/* storage bloqueado: el carrito funciona solo en memoria */
	}
}

function render(): void {
	const container = document.getElementById('cart');
	if (container) {
		container.innerHTML = cartSummaryHTML(lines, nombres, precios);
	}
}

function hidratar(items: MenuItem[]): void {
	nombres = Object.fromEntries(items.map((item) => [item.id, item.nombre]));
	precios = Object.fromEntries(items.map((item) => [item.id, item.precio]));
	let guardadas: CartLine[] = [];
	try {
		guardadas = parsear(localStorage.getItem(STORAGE_KEY));
	} catch {
		guardadas = [];
	}
	lines = reconciliar(guardadas, Object.keys(precios));
	persistir();
	render();
}

function manejarClick(event: Event): void {
	const target = (event.target as HTMLElement).closest<HTMLElement>(
		'[data-agregar], [data-mas], [data-menos], [data-quitar]',
	);
	if (!target) {
		return;
	}
	if (target.dataset.agregar) {
		lines = agregar(lines, target.dataset.agregar);
	} else if (target.dataset.mas) {
		lines = cambiarCantidad(lines, target.dataset.mas, 1);
	} else if (target.dataset.menos) {
		lines = cambiarCantidad(lines, target.dataset.menos, -1);
	} else if (target.dataset.quitar) {
		lines = quitar(lines, target.dataset.quitar);
	} else {
		return;
	}
	persistir();
	render();
}

export function initCart(): void {
	document.addEventListener('click', manejarClick);
	window.addEventListener('menu:cargado', (event) => {
		hidratar((event as CustomEvent<MenuItem[]>).detail);
	});
}
