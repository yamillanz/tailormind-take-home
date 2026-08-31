import { ORDER_ENDPOINT } from '../config';
import { clearCart, getLines } from './cart';
import type { MenuItem } from './product-card';
import { construirPayload, type Cliente } from './order-payload';

type OrderResponse =
	| { ok: true; fila: number; timestamp: string }
	| { ok: false; error: string };

let items: MenuItem[] = [];
let enviando = false;
let form: HTMLFormElement;
let status: HTMLElement;

function successHTML(fila: number): string {
	return `
<div class="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800" role="status">
	Orden enviada — fila ${fila}. ¡Gracias por tu pedido!
</div>`.trim();
}

function errorHTML(mensaje: string): string {
	return `
<div class="rounded-xl border border-brand-200 bg-brand-50 p-4 text-brand-800" role="alert">
	${mensaje}
</div>`.trim();
}

function setBoton(boton: HTMLButtonElement, enviando: boolean): void {
	boton.disabled = enviando;
	boton.textContent = enviando ? 'Enviando…' : 'Enviar orden';
}

async function enviar(event: SubmitEvent): Promise<void> {
	event.preventDefault();
	if (enviando) return;
	const form = event.currentTarget as HTMLFormElement;
	const boton = form.querySelector<HTMLButtonElement>('[data-enviar]');
	if (!boton) return;

	const data = new FormData(form);
	const cliente: Cliente = {
		nombre: String(data.get('nombre') ?? ''),
		email: String(data.get('email') ?? ''),
	};

	enviando = true;
	setBoton(boton, true);
	status.innerHTML = '';
	try {
		const payload = construirPayload(getLines(), items, cliente);
		const res = await fetch(ORDER_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain;charset=utf-8' },
			body: JSON.stringify(payload),
		});
		const respuesta = (await res.json()) as OrderResponse;
		if (respuesta.ok) {
			status.innerHTML = successHTML(respuesta.fila);
			clearCart();
			form.reset();
		} else {
			status.innerHTML = errorHTML(respuesta.error);
		}
	} catch {
		status.innerHTML = errorHTML('No se pudo enviar la orden. Inténtalo de nuevo.');
	} finally {
		enviando = false;
		setBoton(boton, false);
	}
}

export function initOrder(): void {
	form = document.getElementById('order-form') as HTMLFormElement;
	status = document.getElementById('order-status') as HTMLElement;
	if (!form || !status) return;

	form.addEventListener('submit', (event) => void enviar(event as SubmitEvent));
	window.addEventListener('menu:cargado', (event) => {
		items = (event as CustomEvent<MenuItem[]>).detail;
	});
	window.addEventListener('cart:cambio', (event) => {
		const { hayLineas } = (event as CustomEvent<{ hayLineas: boolean }>).detail;
		form.classList.toggle('hidden', !hayLineas);
	});
}
