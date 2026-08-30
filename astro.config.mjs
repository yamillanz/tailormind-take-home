// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://yamillanz.github.io',
  base: '/tailormind-take-home',

  vite: {
    plugins: [tailwindcss()],
  },
});