// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// TODO: update once the domain is purchased (see plan's "Open items" #1).
// Sitemap generation and canonical URLs both depend on this being correct.
const SITE_URL = 'https://moneydoorfxacademy.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // Deliberately NOT `output: 'server'`. Every page here is static marketing
  // content that should be prerendered HTML for SEO and speed; only
  // /api/register needs a runtime. Astro's default static output plus an
  // adapter lets individual routes opt into SSR with `export const prerender
  // = false`, so we get one serverless function instead of turning 26 static
  // pages into server-rendered ones. Session cookies later work the same way
  // — opt in the routes that need them.
  adapter: vercel(),

  // /contact was the old Join Now destination; the page moved to /join when the
  // register form landed on it. 301 rather than 302 — the move is permanent and
  // we want the link equity to follow.
  // One entry only per path — Astro normalises the trailing slash, so
  // declaring both '/contact' and '/contact/' collides on the same route.
  redirects: {
    '/contact': { status: 301, destination: '/join/' },
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap({
    // /thank-you and the API route carry no SEO value and shouldn't be crawled.
    filter: (page) => !page.includes('/thank-you') && !page.includes('/api/'),
  })]
});
