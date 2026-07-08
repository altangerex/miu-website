// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Real production domain (per the company profile: miu.mn already owned).
  site: 'https://miu.mn',
  output: 'static',
  i18n: {
    defaultLocale: 'mn',
    locales: ['mn', 'en'],
    routing: {
      // Mongolian is the default locale but we keep the explicit /mn/ prefix
      // for clarity and correct hreflang.
      prefixDefaultLocale: true,
    },
  },
});
