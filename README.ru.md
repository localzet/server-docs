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

Существующие страницы написаны по-русски. Английский основной справочник с русским дублем остаётся отдельной задачей; текущий сайт ещё не является полностью двуязычным.

Существующие страницы описывают API линии 4.x. Ветка разработки Server относится к 7.x; примеры необходимо проверить перед использованием с этой веткой.

## Структура

- `src/pages`: MDX-контент и маршруты.
- `src/components`: навигация, поиск и шаблоны страниц.
- `src/mdx`: преобразования MDX и локальный поисковый индекс.
- `public`: статические файлы.
- `scripts/generate-sitemap.js`: генератор sitemap.

CI собирает сайт и выполняет lint при push и pull request. Деплой Pages запускается вручную через workflow dispatch. Аудит зависимостей и успешная статическая сборка — разные проверки.

## Автор и лицензия

Ivan Zorin (`localzet`), <creator@localzet.com>, https://www.localzet.com. Copyright © 2026 Localzet Group для своих изменений. GNU AGPL v3 или новее, см. [LICENSE](LICENSE). Сохраняются исходное авторство и лицензии сторонних компонентов; [.github/AUTHORS.md](.github/AUTHORS.md).
