import type { CartLine } from './cart-logic';
import type { MenuItem } from './product-card';

export interface Cliente {
	nombre: string;
	email: string;
}

export interface OrderPayload {
	cliente: { nombre: string; email: string };
	items: { id: string; nombre: string; cantidad: number; precioUnitario: number }[];
	total: number;
}

export function construirPayload(
	lines: CartLine[],
	items: MenuItem[],
	cliente: Cliente,
): OrderPayload {
	if (lines.length === 0) {
		throw new Error('El carrito está vacío');
	}
	const porId = new Map(items.map((item) => [item.id, item]));
	const itemsPayload = lines.map((line) => {
		const item = porId.get(line.id);
		if (!item) {
			throw new Error(`Producto no encontrado: ${line.id}`);
		}
		return {
			id: item.id,
			nombre: item.nombre,
			cantidad: line.cantidad,
			precioUnitario: item.precio,
		};
	});
	const total = itemsPayload.reduce((sum, it) => sum + it.cantidad * it.precioUnitario, 0);
	return {
		cliente: { nombre: cliente.nombre.trim(), email: cliente.email.trim() },
		items: itemsPayload,
		total,
	};
}
