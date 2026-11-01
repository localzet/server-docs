# Документация Localzet Server

[English](README.md)

Исходники сайта Next.js/MDX: https://server.localzet.com. Код библиотеки: [localzet/Server](https://github.com/localzet/Server).

## Разработка

Проверенное окружение — Node.js 22 и npm. Используйте закоммиченный npm lock-файл:

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Dev-сайт открывается на http://localhost:3000. Результат сборки — `out/`. Postbuild генерирует sitemap и копирует его в статический экспорт. Сборка не публикует сайт.

## Границы документации

Справочник Server описывает ветку разработки 7.x. Переключатель проектов открывает отдельную документацию Cluster, Cron, HTTP Client, MQTT, PSR-7, Proxy, SOCKS5, Socket.IO, Storage, Tunnel и Noter. Для каждого проекта выделены собственная боковая навигация, поиск, метаданные и сведения о совместимости.

Старые страницы остаются в архиве, помечены предупреждением и исключены из поиска и sitemap. Сайт написан преимущественно по-русски и не полностью двуязычен. Документация связанных проектов отражает проверенные исходники и Composer lock, но не заявляет готовность к production или поведение, не подтверждённое перечисленными проверками.

## Структура

- `src/pages`: MDX-контент и маршруты.
- `src/components`: навигация, поиск и шаблоны страниц.
- `src/mdx`: преобразования MDX и локальный поисковый индекс.
- `public`: статические файлы.
- `scripts/generate-sitemap.js`: генератор sitemap.

CI собирает сайт и выполняет lint при push и pull request. GitHub Pages публикуется только ручным запуском `.github/workflows/deploy.yml` для выбранной ветки. Успешная статическая сборка не проверяет runtime-поведение библиотеки Server; аудит зависимостей — отдельная проверка.

## Автор и лицензия

Copyright © 2016-2026 [Localzet Group](https://www.localzet.com/). All rights reserved. GNU AGPL v3 или новее, см. [LICENSE](LICENSE). Сохраняются исходное авторство и лицензии сторонних компонентов; [.github/AUTHORS.md](.github/AUTHORS.md).
