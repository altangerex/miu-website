# MIU.mn — datacom.mn (cPanel) deploy guide

Static site (no database, no PHP admin panel) + one small PHP script for the contact form. Simple to host.

## 1. Build

```
npm install
npm run build
```

This produces a `dist/` folder — that whole folder is what goes on the server.

## 2. Point the domain

In cPanel → **Domains**, make sure `miu.mn` (and `www.miu.mn`) point at the `public_html` folder you'll upload to (or an addon-domain folder if `miu.mn` isn't the primary domain on the account).

## 3. Upload

Upload the **contents** of `dist/` (not the folder itself) into `public_html/` via cPanel File Manager or FTP:
- All the `.html` files and the `_astro/` folder (CSS/JS assets)
- `contact.php`
- `.htaccess` (cPanel File Manager hides dotfiles by default — enable "Show Hidden Files" in Settings, or upload via FTP)
- `favicon.svg`, `i18n/`, `styles/`

## 4. Configure the contact form

Open `public_html/contact.php` and confirm the `$TO` address:

```php
$TO = 'info@miu.mn';
```

Create that mailbox in cPanel → **Email Accounts** if it doesn't exist yet (sending to a mailbox on the same domain/server is the most reliable — avoids spam filtering that can hit cross-domain `mail()` sends).

## 5. Enable HTTPS

cPanel → **SSL/TLS Status** → run AutoSSL for `miu.mn`. The `.htaccess` already force-redirects HTTP → HTTPS once a certificate is active — don't enable that redirect before SSL is issued, or the site will be unreachable.

## 6. Verify

- `https://miu.mn/` → redirects to `/mn/`
- Language toggle (top right) switches `/mn/…` ↔ `/en/…`
- Submit the contact form with a real email — confirm it lands in the `info@miu.mn` inbox, and that the page shows the "мессежийг хүлээн авлаа" success banner after redirect
- A bad/missing URL shows the custom 404 page

## Updating content later

All page copy lives in two files — edit these and rebuild, no code changes needed for text/number changes:
- `public/i18n/mn.json` (Mongolian)
- `public/i18n/en.json` (English)

Then `npm run build` and re-upload `dist/`.

## Known placeholders / things to confirm with the client before launch

- **Logo**: now built to the real Brand Guidelines v1.0 spec (`src/components/Logo.astro` + `BulbIcon.astro`) — the node-mesh bulb icon was hand-traced from a high-res crop of the brand book's icon-only lockup, faithful but not a pixel-exact vector export. If MIU has the original vector/AI/SVG source file, swap it in for perfect fidelity.
- **Photography**: no product/team/site photos are used yet — the design is copy+data driven, per the brand book's own rule against AI-generated or stock photography of real sites/people. Adding real photos (office, products, team) would strengthen the marketing pitch.
- **Domain**: `astro.config.mjs` assumes `https://miu.mn` is the live domain (used for canonical URLs / hreflang / Open Graph tags) — confirm this is correct before going live.
- **Content accuracy**: all copy (vision/mission/values, brand list, financials, client list) was drafted from `MIU_Компанийн_танилцуулга.docx` and the Brand Guidelines PDF — have the client proofread before publishing, especially the sales figures and "Одоогийн бодит харилцагч" (current client) claim.
- **Highlights section is not a news feed**: the Home page's "Онцлох баримт / Key facts" cards (`src/components/Highlights.astro`) are real, verifiable facts, deliberately NOT fabricated news posts (MIU has no news content yet). Swap in real news/press items later using the same card layout if MIU starts publishing any.

## The interactive redesign (2026-07-08)

The homepage was redesigned around one signature interaction — **the Capability Explorer** (`#explorer`): a 3-stage guided-selling tool (pick a supply tier → project stage → get a Needs Brief) that replaces a generic feature grid. It's fully static-compatible:
- No new runtime dependency — everything is vanilla JS/CSS (no GSAP, no jsPDF). "Download brief" uses `window.print()` with a dedicated print stylesheet, not a PDF library.
- The Explorer, the **Global Network diagram**, and the Contact page share state via `localStorage['miu_explorer']` and a `CustomEvent('miu:tier', …)` on `document` — all client-side, nothing to configure on the server.
- Every animation has an explicit `prefers-reduced-motion` fallback (checked in JS + a CSS `@media` block) — motion is decoration, not a requirement to read the content.

**Deliberately not built in this pass** (would need real assets, not fabricated ones):
- A "Trust Hotspots" section (an illustrated mining-plant cross-section with clickable brand pins) — needs either a real site/control-room photo or a commissioned illustration; stock imagery would weaken it more than help.
- The Network diagram's looping "data-packet" pulse-dot animation — the static + hover/click interaction is built; the ambient looping micro-animation was scoped out to limit build risk.

If you want either added later, they're additive — no architecture changes needed.
