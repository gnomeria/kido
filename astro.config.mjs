import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});