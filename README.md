# Localzet Server documentation

[Русская версия](README.ru.md)

Next.js/MDX source for https://server.localzet.com. The library source is [localzet/Server](https://github.com/localzet/Server).

## Development

Node.js 22 and npm are the verified toolchain. Use the committed npm lockfile:

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Open http://localhost:3000 during development. Build output is `out/`; the postbuild command generates the sitemap and copies it into the static export. `npm run build` does not publish the site.

## Scope

The existing site pages are in Russian. An English primary handbook with a Russian duplicate remains a separate documentation task. Do not claim that the current site is fully bilingual.

Existing handbook pages describe the legacy 4.x API. The Server development branch targets 7.x: examples must be reviewed before use with that branch.

## Source layout

- `src/pages`: MDX content and routes.
- `src/components`: navigation, search and layouts.
- `src/mdx`: MDX transforms and local search index generation.
- `public`: static assets.
- `scripts/generate-sitemap.js`: sitemap generation.

CI builds and lints the site on pushes and pull requests. Pages deployment is manual through workflow dispatch. Dependency audit findings and a successful static build are separate checks.

## Author and license

Ivan Zorin (`localzet`), <creator@localzet.com>, https://www.localzet.com. Copyright © 2026 Localzet Group for its contributions. GNU AGPL v3 or later, see [LICENSE](LICENSE). Original attribution and third-party licenses remain applicable; [.github/AUTHORS.md](.github/AUTHORS.md).
