export interface MenuItem {
	id: string;
	nombre: string;
	descripcion: string;
	precio: number;
}

const clp = new Intl.NumberFormat('es-CL', {
	style: 'currency',
	currency: 'CLP',
	maximumFractionDigits: 0,
});

export function formatPrecio(precio: number): string {
	return clp.format(precio);
}

function escapeHTML(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export function productCardHTML(item: MenuItem): string {
	return `
<article class="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
	<h2 class="text-xl font-semibold">${escapeHTML(item.nombre)}</h2>
	<p class="mt-1 text-sm text-stone-600">${escapeHTML(item.descripcion)}</p>
	<p class="mt-3 text-lg font-semibold text-amber-600">${formatPrecio(item.precio)}</p>
	<button type="button" data-agregar="${escapeHTML(item.id)}"
		class="mt-4 w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none">
		Agregar
	</button>
</article>`.trim();
}
