# DSD-003 — проверка ремонта зависимостей

27.11.2026. База: `635e70af7c4c2fb840b0e45f371952a7c2335fcc`. Node 22.23.5 / npm 10.9.9. Профили Node, React, Storybook 8.6.19 и контракт публикуемой библиотеки сохранены.

## Изменение

[Исходные восемь GitHub alerts](alerts-before.json): шесть для brace-expansion, один для minimatch, один для uuid.

- brace-expansion: совместимые обновления 1.1.14 → 1.1.22, 2.1.0 → 2.1.8, 5.0.5 → 5.1.0. После дедупликации остаются 1.1.22 и 5.1.0.
- minimatch 9/10 → 11.0.9 у пяти конкретных родителей. ESLint сохраняет minimatch 3.1.5. Одновременно glob 10/11/13 → 14.0.6 у трёх родителей: старый glob проверяет `instanceof RegExp`, тогда как minimatch 11 возвращает Matcher. Обновление только minimatch несовместимо. Даже актуальный API Extractor 7.60.2 закрепляет minimatch 10.2.3, поэтому одного обновления родителя недостаточно.
- uuid 9.0.1 → 11.1.1 только внутри Storybook Actions. Сохранены CJS/ESM; addon использует v4.

Overrides адресованы конкретным родителям. Начальная попытка с глобальными селекторами диапазонов приводила к `npm ls` / ELSPROBLEMS после следующей установки npm 10. Исправлена по независимому review; добавлен тест отдельного процесса npm. Не применялись force, legacy-peer-deps или ручная подмена установленного кода. [Изменения дерева](dependency-changes.json) включают зависимости нового glob/minimatch и дедупликацию; production-зависимости не обновлялись.

## Доказательства

- Обычный `npm ci --no-audit --no-fund` прошёл после финальной правки overrides. Отдельный `npm ls minimatch glob uuid brace-expansion --all --json` вернул exit 0: [результат](dependency-tree.json).
- Шесть тестов в `scripts/tests/dependency-security.test.js` прошли: точные advisory ranges; дерево npm в новом процессе; раскрытие braces; glob у всех трёх родителей (sync/async/iterator, extglob, вложенность и ignore); API minimatch у фактических родителей; Actions через CJS/ESM с v4 ID и сохранением аргументов. Проверен отказ uuid v5 при недостаточном буфере.
- Полный [quality-профиль](quality-report.json): 11/11 PASS. Включает 182 компонентных теста, tooling, types/lint/format, build, package consumer, Storybook build и локальный Code Connect check. Consumer проверяет установку архива, ESM/CJS, SSR, TypeScript, theme/CSS и Vite.
- В первом прогоне исправлены lint-импорт URL и формат audit.json. npm pack был ограничен песочницей; повторный обычный профиль с доступом к npm cache прошёл полностью.
- Проверки разработчика: env:check, lint и 68 tooling-тестов прошли.
- Все 11 исходных JSON токенов, два файла генератора и четыре результата совпали побайтово: [baseline](baseline.json), [сравнение](token-comparison.json). После build генератор повторно запущен, поскольку Vite очищает dist. Исходники компонентов не менялись.
- Свежий временный Storybook 8.6.19 вернул HTTP 200 и прежние 249 записей, включая 10 InputPassword: [smoke](storybook-smoke.json). Временный порт 6007 остановлен после проверки; существующий 6006 не затронут.
- Независимый ds-reviewer выявил нестабильные overrides и неполную проверку advisory range. После исправлений повторно подтвердил npm ls exit 0, 6/6 tests и отсутствие оставшихся P1/P2 в проверенном diff. Это технический review, а не приёмка владельца.

## Ограничения и отдельная находка

[npm audit](audit.json) не сообщает исходные три уязвимых пакета, но возвращает три high-записи по одной другой цепочке: Zod / zod-validation-error / Code Connect, [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). Записана отдельно в BACKLOG как DSD-007. Переход Code Connect/Zod не входит в согласованные восемь alerts; этот ремонт не означает отсутствие всех уязвимостей.

Визуальная приёмка всех компонентов и проверка всех браузеров не выполнялись. Figma writes, внешняя публикация Code Connect и npm publication не выполнялись. Обязательные CI и GitHub alerts после слияния проверяются отдельно в итоговом PR. Приёмка владельца остаётся отдельным решением.

## Первичные источники

- [minimatch: изменения API в 11](https://github.com/isaacs/minimatch/blob/main/changelog.md).
- [uuid 11.1.1: backport исправления](https://github.com/uuidjs/uuid/blob/v11.1.1/CHANGELOG.md).
- GitHub Dependabot API этого репозитория и npm metadata указанных версий, прочитаны 27.11.2026; исходный список alerts сохранён рядом.
