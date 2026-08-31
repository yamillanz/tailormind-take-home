export interface CartLine {
	id: string;
	cantidad: number;
}

export type PrecioMap = Record<string, number>;

export const CANTIDAD_MIN = 1;
export const CANTIDAD_MAX = 99;

function clampCantidad(cantidad: number): number {
	return Math.min(CANTIDAD_MAX, Math.max(CANTIDAD_MIN, cantidad));
}

export function agregar(lines: CartLine[], id: string): CartLine[] {
	const existente = lines.find((line) => line.id === id);
	if (existente) {
		return lines.map((line) =>
			line.id === id ? { ...line, cantidad: clampCantidad(line.cantidad + 1) } : line,
		);
	}
	return [...lines, { id, cantidad: CANTIDAD_MIN }];
}

export function cambiarCantidad(lines: CartLine[], id: string, delta: number): CartLine[] {
	return lines.map((line) =>
		line.id === id ? { ...line, cantidad: clampCantidad(line.cantidad + delta) } : line,
	);
}

export function quitar(lines: CartLine[], id: string): CartLine[] {
	return lines.filter((line) => line.id !== id);
}

export function total(lines: CartLine[], precios: PrecioMap): number {
	return lines.reduce((sum, line) => sum + line.cantidad * (precios[line.id] ?? 0), 0);
}

export function serializar(lines: CartLine[]): string {
	return JSON.stringify(lines);
}

export function parsear(json: string | null): CartLine[] {
	if (!json) {
		return [];
	}
	try {
		const data = JSON.parse(json);
		if (!Array.isArray(data)) {
			return [];
		}
		return data
			.filter(
				(entry): entry is { id: string; cantidad: number } =>
					!!entry &&
					typeof entry.id === 'string' &&
					entry.id.trim() !== '' &&
					Number.isFinite(Number(entry.cantidad)),
			)
			.map((entry) => ({ id: entry.id, cantidad: Number(entry.cantidad) }));
	} catch {
		return [];
	}
}

export function reconciliar(lines: CartLine[], idsDisponibles: string[]): CartLine[] {
	const disponibles = new Set(idsDisponibles);
	return lines
		.filter((line) => disponibles.has(line.id))
		.map((line) => ({ ...line, cantidad: clampCantidad(line.cantidad) }));
}
