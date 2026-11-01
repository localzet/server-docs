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

The current handbook describes the Server 7.x development line and is written primarily in Russian. It covers installation, runtime lifecycle, event loops, protocols, HTTP, sessions, gateway behavior, security, operations and testing. The API reference is based on the source tree linked above; it is not a promise that every class has a generated reference page.

Pages outside the current handbook and API reference are retained as a 4.x archive. They carry an archive notice, are excluded from the current search index and sitemap, and may contain obsolete examples. The site is not fully bilingual.

## Source layout

- `src/pages`: MDX content and routes.
- `src/components`: navigation, search and layouts.
- `src/mdx`: MDX transforms and local search index generation.
- `public`: static assets.
- `scripts/generate-sitemap.js`: sitemap generation.

CI builds and lints the site on pushes and pull requests. GitHub Pages deployment is performed only by manually dispatching `.github/workflows/deploy.yml` from the intended branch. A successful static build does not verify runtime behavior of the Server library; dependency audit findings are a separate check.

## Author and license

Ivan Zorin (`localzet`), <creator@localzet.com>, https://www.localzet.com. Copyright © 2026 Localzet Group for its contributions. GNU AGPL v3 or later, see [LICENSE](LICENSE). Original attribution and third-party licenses remain applicable; [.github/AUTHORS.md](.github/AUTHORS.md).
