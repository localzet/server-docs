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

The Server handbook describes the current stable release, 7.2.2. The project switcher also provides separate documentation areas for Cluster, Cron, HTTP Client, MQTT, PSR-7, Proxy, SOCKS5, Socket.IO, Storage, Tunnel, Noter, and Triangle Media. Each area has its own sidebar, search results, project metadata and compatibility notes. Media documents the published v1.1.0 Engine 8 package separately from the prepared but unreleased 2.0.0 Engine 9 migration.

The AI-readable project map is available at [`public/llms.txt`](public/llms.txt); public pages are indexed in `public/sitemap.xml` and `public/robots.txt`.

Older pages remain in the archive, carry an archive notice, and are excluded from the search index and sitemap. The Server handbook is primarily Russian; selected related-project guides are available in English and Russian. Related-project pages reflect checked out sources and verified release status; they do not imply production readiness or unverified runtime behavior.

## Source layout

- `src/pages`: MDX content and routes.
- `src/components`: navigation, search and layouts.
- `src/mdx`: MDX transforms and local search index generation.
- `public`: static assets.
- `scripts/generate-sitemap.js`: sitemap generation.

CI builds and lints the site on pushes and pull requests. GitHub Pages deploys after a push to `main`; pull requests only build and validate the site. The deployment workflow can also be dispatched manually. A successful static build does not verify runtime behavior of the Server library; dependency audit findings are a separate check.

## Author and license

Copyright © 2016-2026 [Localzet Group](https://www.localzet.com/). All rights reserved. GNU AGPL v3 or later, see [LICENSE](LICENSE). Original attribution and third-party licenses remain applicable; [.github/AUTHORS.md](.github/AUTHORS.md).
