import { formatPrecio } from './product-card';
import { CANTIDAD_MAX, CANTIDAD_MIN, type CartLine, type PrecioMap } from './cart-logic';

export interface CartItemNombre {
	id: string;
	nombre: string;
}

const BTN_STEPPER =
	'h-8 w-8 rounded-lg border border-stone-300 bg-white text-lg leading-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none';

export function cartLineHTML(
	line: CartLine,
	nombres: Record<string, string>,
	precios: PrecioMap,
): string {
	const nombre = nombres[line.id] ?? line.id;
	const precio = precios[line.id] ?? 0;
	return `
<li class="flex flex-col gap-2 border-b border-stone-200 py-3 last:border-0" data-linea="${line.id}">
	<div class="flex items-start justify-between gap-2">
		<p class="font-medium">${nombre}</p>
		<button type="button" data-quitar="${line.id}"
			class="rounded-lg px-2 py-1 text-sm text-brand-600 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none">
			Quitar
		</button>
	</div>
	<div class="flex items-center justify-between gap-2">
		<div class="flex items-center gap-1" role="group" aria-label="Cantidad de ${nombre}">
			<button type="button" data-menos="${line.id}" class="${BTN_STEPPER}"
				aria-label="Quitar una unidad de ${nombre}" ${line.cantidad <= CANTIDAD_MIN ? 'disabled' : ''}>−</button>
			<span class="w-8 text-center text-sm" data-cantidad>${line.cantidad}</span>
			<button type="button" data-mas="${line.id}" class="${BTN_STEPPER}"
				aria-label="Agregar una unidad de ${nombre}" ${line.cantidad >= CANTIDAD_MAX ? 'disabled' : ''}>+</button>
		</div>
		<div class="text-right">
			<p class="text-xs text-stone-500">${formatPrecio(precio)} c/u</p>
			<p class="font-semibold text-amber-600" data-subtotal>${formatPrecio(precio * line.cantidad)}</p>
		</div>
	</div>
</li>`.trim();
}

export function cartSummaryHTML(
	lines: CartLine[],
	nombres: Record<string, string>,
	precios: PrecioMap,
): string {
	if (lines.length === 0) {
		return `
<div class="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-800" role="status">
	Tu carrito está vacío
</div>`;
	}
	const suma = lines.reduce((sum, line) => sum + line.cantidad * (precios[line.id] ?? 0), 0);
	return `
<div class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
	<h2 class="text-xl font-semibold">Tu pedido</h2>
	<ul class="mt-3">${lines.map((line) => cartLineHTML(line, nombres, precios)).join('')}</ul>
	<div class="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
		<p class="font-semibold">Total</p>
		<p class="text-lg font-bold text-amber-600" data-total aria-live="polite">${formatPrecio(suma)}</p>
	</div>
</div>`.trim();
}
