import { describe, expect, it } from 'vitest';
import {
	agregar,
	cambiarCantidad,
	parsear,
	quitar,
	reconciliar,
	serializar,
	total,
} from './cart-logic';

const PRECIOS = { 'pizza-margarita': 9900, 'bebida-cola': 1500 };

describe('agregar', () => {
	it('crea línea nueva con cantidad 1', () => {
		expect(agregar([], 'pizza-margarita')).toEqual([{ id: 'pizza-margarita', cantidad: 1 }]);
	});

	it('incrementa cantidad sin duplicar línea', () => {
		const lines = agregar([], 'pizza-margarita');
		const result = agregar(lines, 'pizza-margarita');
		expect(result).toEqual([{ id: 'pizza-margarita', cantidad: 2 }]);
		expect(result).toHaveLength(1);
	});
});

describe('cambiarCantidad', () => {
	const lines = [
		{ id: 'a', cantidad: 1 },
		{ id: 'b', cantidad: 99 },
	];

	it('incrementa y decrementa dentro de límites', () => {
		expect(cambiarCantidad(lines, 'a', 1)[0].cantidad).toBe(2);
		expect(cambiarCantidad([{ id: 'a', cantidad: 5 }], 'a', -1)[0].cantidad).toBe(4);
	});

	it('no baja de 1', () => {
		expect(cambiarCantidad(lines, 'a', -1)[0].cantidad).toBe(1);
	});

	it('no sube de 99', () => {
		expect(cambiarCantidad(lines, 'b', 1)[1].cantidad).toBe(99);
	});
});

describe('quitar', () => {
	it('elimina la línea y deja las demás', () => {
		const lines = [
			{ id: 'a', cantidad: 2 },
			{ id: 'b', cantidad: 1 },
		];
		expect(quitar(lines, 'a')).toEqual([{ id: 'b', cantidad: 1 }]);
	});
});

describe('total', () => {
	it('suma cantidad × precio de todas las líneas', () => {
		const lines = [
			{ id: 'pizza-margarita', cantidad: 2 },
			{ id: 'bebida-cola', cantidad: 1 },
		];
		expect(total(lines, PRECIOS)).toBe(21300);
	});

	it('es 0 con carrito vacío', () => {
		expect(total([], PRECIOS)).toBe(0);
	});
});

describe('persistencia', () => {
	it('roundtrip conserva solo {id, cantidad}', () => {
		const lines = [
			{ id: 'pizza-margarita', cantidad: 3 },
			{ id: 'bebida-cola', cantidad: 1 },
		];
		const restored = parsear(serializar(lines));
		expect(restored).toEqual(lines);
		expect(JSON.parse(serializar(lines))).not.toHaveProperty('0.precio');
		expect(JSON.parse(serializar(lines))[0]).not.toHaveProperty('nombre');
	});

	it('maneja null y JSON corrupto devolviendo carrito vacío', () => {
		expect(parsear(null)).toEqual([]);
		expect(parsear('{{{no-json')).toEqual([]);
		expect(parsear('{"no":"es-array"}')).toEqual([]);
	});

	it('descarta entradas con forma inválida', () => {
		const json = JSON.stringify([
			{ id: 'a', cantidad: 2 },
			{ id: '', cantidad: 1 },
			{ id: 'b' },
			null,
		]);
		expect(parsear(json)).toEqual([{ id: 'a', cantidad: 2 }]);
	});
});

describe('reconciliar', () => {
	it('descarta líneas cuyo id ya no está en el menú', () => {
		const lines = [
			{ id: 'pizza-margarita', cantidad: 2 },
			{ id: 'producto-huerfano', cantidad: 5 },
		];
		expect(reconciliar(lines, Object.keys(PRECIOS))).toEqual([
			{ id: 'pizza-margarita', cantidad: 2 },
		]);
	});

	it('ajusta cantidades fuera de rango', () => {
		const lines = [
			{ id: 'pizza-margarita', cantidad: 0 },
			{ id: 'bebida-cola', cantidad: 150 },
		];
		expect(reconciliar(lines, Object.keys(PRECIOS))).toEqual([
			{ id: 'pizza-margarita', cantidad: 1 },
			{ id: 'bebida-cola', cantidad: 99 },
		]);
	});
});
