import { describe, expect, it } from 'vitest';
import { construirPayload } from './order-payload';
import type { MenuItem } from './product-card';

const ITEMS: MenuItem[] = [
	{ id: 'pizza-margarita', nombre: 'Pizza Margarita', descripcion: '…', precio: 9900 },
	{ id: 'bebida-cola', nombre: 'Bebida Cola 500ml', descripcion: '…', precio: 1500 },
];

const CLIENTE = { nombre: '  Prueba  ', email: 'prueba@example.com' };

describe('construirPayload', () => {
	it('arma items exactos y total = Σ cantidad × precioUnitario', () => {
		const payload = construirPayload(
			[
				{ id: 'pizza-margarita', cantidad: 2 },
				{ id: 'bebida-cola', cantidad: 1 },
			],
			ITEMS,
			CLIENTE,
		);
		expect(payload).toEqual({
			cliente: { nombre: 'Prueba', email: 'prueba@example.com' },
			items: [
				{ id: 'pizza-margarita', nombre: 'Pizza Margarita', cantidad: 2, precioUnitario: 9900 },
				{ id: 'bebida-cola', nombre: 'Bebida Cola 500ml', cantidad: 1, precioUnitario: 1500 },
			],
			total: 21300,
		});
	});

	it('falla con carrito vacío', () => {
		expect(() => construirPayload([], ITEMS, CLIENTE)).toThrow();
	});

	it('falla si un id de línea no existe en el menú (fail fast)', () => {
		expect(() => construirPayload([{ id: 'fantasma', cantidad: 1 }], ITEMS, CLIENTE)).toThrow(
			/fantasma/,
		);
	});
});
