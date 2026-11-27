# AI-PDP-DS

Самостоятельная дизайн-система React + TypeScript + styled-components. Пакет: `@evgeni_design_84/ai-pdp-ds`. Исходники, токены, Storybook, спецификации, исследования и локальные инструменты находятся в этой папке.

## Запуск

Из корня этой папки, Node 22 и npm согласно package.json:

```sh
npm ci
npm run tokens:build
npm run storybook
```

Работа с исходниками начинается из корня этой папки, включая отдельную экспортированную копию. Родительские package/config/node_modules и .git не нужны. Credentials Figma/Chromatic/npm для локальной разработки не требуются; .env не передаётся.

[Подключение пакета, CSS/fonts и темы](docs/library-setup.md). [Правила библиотеки](docs/library-conventions.md). [Развитие и задачи](docs/development.md). [Вход агента](AGENTS.md).

## Требования и история

Общий [бриф](product-discovery/brief.md), исследования в product-discovery/research и решения в product-discovery/decisions. Живые контракты — component-specs/<id>/spec.md; реализация — src/components/<id>. Для новых работ используется STATE журнала задачи, без отдельного state.json.

Старые доказательства/receipts находятся в history соответствующего компонента или Discovery. Они сохраняют исходные хеши и происхождение; это архивные результаты своей версии. Browser-проверка InputPassword была исключена владельцем; Combobox отменён. Перенос не создаёт новый PASS или новую приёмку.

## Проверки и поставка

```sh
npm run env:check
npm run typecheck
npm run lint
npm run test:coverage
npm run test:tooling
npm run build
npm run package:check
npm run storybook:build
npm run figma:check
```

Полный запуск — quality:report; частичный план — quality:report --component InputPassword --change logic --plan. Сборка не доказывает визуальный паритет и ручную доступность.

В .github находятся workflow этой библиотеки для самостоятельного репозитория. Внутри общего разработчика GitHub не обнаруживает вложенные workflow автоматически; корневой CI отдельно запускает локальные проверки этой папки. Внешние публикации/синхронизации этой перестройкой не включаются. Prepare устанавливает hooks только при собственном .git и не меняет Git родителя.

Передача исходников: копировать эту папку без node_modules, dist, coverage, storybook-static, .local, .git и приватного .env. package-lock, .storybook, .github, .changeset, .env.example, docs, component-specs и product-discovery входят в поставку. [Лицензия](LICENSE), [история выпуска](CHANGELOG.md).

[Проверка передачи — 27 ноября 2026](product-discovery/evidence/standalone-migration/verification.json): изолированная установка, сборки, 181 тест компонента, 28 tooling tests и пакет/consumer. Это результат конкретной версии, не гарантия будущих изменений.
