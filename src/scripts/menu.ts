import { MENU_ENDPOINT } from '../config';
import { productCardHTML, type MenuItem } from './product-card';

type MenuResponse = { ok: true; items: MenuItem[] } | { ok: false; error: string };

function skeletonsHTML(): string {
	const card = `
<div class="h-[132px] animate-pulse rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
	<div class="h-5 w-2/3 rounded bg-stone-200"></div>
	<div class="mt-2 h-4 w-full rounded bg-stone-100"></div>
	<div class="mt-3 h-5 w-24 rounded bg-stone-100"></div>
</div>`;
	return `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${card.repeat(6)}</div>`;
}

function emptyHTML(): string {
	return `
<div class="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-800" role="status">
	No hay productos disponibles
</div>`;
}

function errorHTML(): string {
	return `
<div class="rounded-xl border border-brand-200 bg-brand-50 p-4 text-brand-800" role="status">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<p>No se pudo cargar el menú. Inténtalo de nuevo.</p>
		<button type="button" data-retry class="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none">
			Reintentar
		</button>
	</div>
</div>`;
}

function cardsHTML(items: MenuItem[]): string {
	return `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${items
		.map(productCardHTML)
		.join('')}</div>`;
}

async function cargar(container: HTMLElement): Promise<void> {
	container.innerHTML = skeletonsHTML();
	try {
		const res = await fetch(MENU_ENDPOINT);
		const data = (await res.json()) as MenuResponse;
		container.innerHTML =
			data.ok && data.items.length > 0
				? cardsHTML(data.items)
				: data.ok
					? emptyHTML()
					: errorHTML();
		if (data.ok) {
			window.dispatchEvent(new CustomEvent('menu:cargado', { detail: data.items }));
		}
	} catch {
		container.innerHTML = errorHTML();
	}
	if (container.querySelector('[data-retry]')) {
		container.querySelector('[data-retry]')?.addEventListener('click', () => cargar(container));
	}
}

export function initMenu(): void {
	const container = document.getElementById('menu');
	if (container) {
		void cargar(container);
	}
}
