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

## Documentation scope

The Server handbook describes the 7.x development version. The project switcher also provides separate documentation areas for Cluster, Cron, HTTP Client, MQTT, PSR-7, Proxy, SOCKS5, Socket.IO, Storage, Tunnel and Noter. Each area has its own sidebar, search results, project metadata and compatibility notes.

Older pages remain in the archive, carry an archive notice, and are excluded from the search index and sitemap. The site is primarily Russian and is not fully bilingual. Related-project pages reflect the checked out source and Composer lock state; they do not imply production readiness or unverified runtime behavior.

## Source layout

- `src/pages`: MDX content and routes.
- `src/components`: navigation, search and layouts.
- `src/mdx`: MDX transforms and local search index generation.
- `public`: static assets.
- `scripts/generate-sitemap.js`: sitemap generation.

CI builds and lints the site on pushes and pull requests. GitHub Pages deployment is performed only by manually dispatching `.github/workflows/deploy.yml` from the intended branch. A successful static build does not verify runtime behavior of the Server library; dependency audit findings are a separate check.

## Author and license

Copyright © 2016-2026 [Localzet Group](https://www.localzet.com/). All rights reserved. GNU AGPL v3 or later, see [LICENSE](LICENSE). Original attribution and third-party licenses remain applicable; [.github/AUTHORS.md](.github/AUTHORS.md).
