# KOBANI frontend SEO

## Production resources

- Production origin: `https://www.kobanitours.com`
- Sitemap: `https://www.kobanitours.com/sitemap.xml`
- Robots: `https://www.kobanitours.com/robots.txt`

Canonical URLs and public social metadata must always use the production origin. The backend/API origin is never a frontend canonical.

## Metadata

`src/seo.tsx` provides the reusable `SEO` component and shared helpers. It manages one copy of the title, description, robots, Googlebot, canonical, Open Graph and Twitter tags during SPA navigation. It also replaces route-specific JSON-LD safely.

Static public-page metadata is configured in `src/App.tsx`. Tour and article detail pages use their real API content for metadata, canonical slugs, images, breadcrumbs and structured data. New public routes must receive a unique title and description in the static configuration, or render `SEO` with dynamic data.

Login, registration, verification, booking flows, customer pages, admin pages, contributor tools, checkout/success utilities, system states and the client-side 404 are intentionally `noindex`.

Language switching currently changes client-side content without creating separate language URLs, so the frontend intentionally does not publish invented `hreflang` links.

## Sitemap generation

`npm run generate:seo` creates `public/sitemap.xml`. It includes the canonical static public routes and paginates the backend's public-only tour and article endpoints. Those endpoints already restrict results to published, non-deleted content. New published tours and articles therefore enter the sitemap on the next frontend build without manual slug maintenance.

Render/CI builds fail if dynamic content cannot be refreshed, preventing a stale first-time sitemap deployment. Local builds can reuse the last generated dynamic entries during temporary API outages.

The normal `npm run build` command runs sitemap generation before Vite copies `public/sitemap.xml` and `public/robots.txt` into `dist/`.

Validation commands:

```text
npm run seo:validate
npm run build
npm run seo:validate:dist
```

## Render configuration

The frontend Static Site must retain this SPA rewrite:

```text
Source:      /*
Destination: /index.html
Action:      Rewrite
```

Render serves existing files before wildcard rewrites, so `/sitemap.xml`, `/robots.txt`, icons and assets remain real static responses. The publish directory must be `dist`.

## Google Search Console

After deployment, verify the `https://www.kobanitours.com/` URL-prefix or Domain property, inspect the homepage and one published tour/article, then submit `https://www.kobanitours.com/sitemap.xml` in **Indexing → Sitemaps**. Request indexing only after the live URL inspection shows the deployed canonical and an indexable status.
