// Canonical source lives in public/i18n/ so a future PHP page (e.g. the
// contact form) can read the same files directly if needed.
import mn from '../../public/i18n/mn.json';
import en from '../../public/i18n/en.json';

export const locales = ['mn', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'mn';

const dictionaries = { mn, en } as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === 'mn' || value === 'en';
}

/**
 * Returns the full translation dictionary for a locale plus a `t()` helper
 * that resolves dot-paths (e.g. t('nav.about')). Returns the key itself if
 * a path is missing, so a missing string is visible rather than silently blank.
 */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];

  function t(path: string): string {
    const value = path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, dict);
    return typeof value === 'string' ? value : path;
  }

  return { t, dict };
}

/** The whole dictionary, typed. Use for arrays/objects (stats, brands, etc.). */
export function getDict(locale: Locale) {
  return (dictionaries[locale] ?? dictionaries[defaultLocale]) as typeof mn;
}

/**
 * Build a locale-prefixed path. `path` is the locale-agnostic part with a
 * leading slash, e.g. localizedPath('mn', '/about') -> '/mn/about'.
 * localizedPath('mn', '/') -> '/mn/'.
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return `/${locale}${clean}` + (path === '/' ? '/' : '');
}

/**
 * Given the current full pathname (e.g. '/mn/about') return the equivalent
 * path in the target locale ('/en/about'). Used by the language toggle so it
 * swaps the CURRENT page, not the home page.
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${target}/`;
  if (isLocale(segments[0])) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  const joined = '/' + segments.join('/');
  return joined === `/${target}` ? `/${target}/` : joined;
}

/** getStaticPaths helper: one entry per locale. */
export function localeStaticPaths() {
  return locales.map((locale) => ({ params: { locale }, props: { locale } }));
}
