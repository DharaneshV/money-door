// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// TODO: update once the domain is purchased (see plan's "Open items" #1).
// Sitemap generation and canonical URLs both depend on this being correct.
const SITE_URL = 'https://moneydoorfxacademy.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});
