# Архитектура Design System Developer

[AGENTS](AGENTS.md) задаёт роль и полномочия, [PROCESS](PROCESS.md) — жизненный цикл, [BACKLOG](BACKLOG.md) — будущие доработки.

## Папки

```text
design-system-developer/
├── agents/                    # роли отдельных исполнителей
├── skills/                    # процедуры по видам задач
├── docs/
│   ├── standards/             # общие требования
│   └── limitations.md         # границы возможностей
├── directives/                # последовательность действий
├── config/routes.json         # связи скиллов, директив, стандартов и ролей
├── templates/                 # brief, Component Spec и набор инструментов
│   └── project/scripts/
├── scripts/
│   ├── environment/           # проекты, журналы, экспорт, диагностика, hooks
│   └── tests/                 # проверки инструментов
├── .github/                   # CI и сопровождение репозитория
├── .husky/                    # конфигурация локальных Git hooks
├── .local/
│   └── toolchains/            # используемый локальный runtime
├── node_modules/              # установленные инструменты разработчика
└── projects/
    └── ai-pdp-ds/             # самостоятельный пример дизайн-системы
        ├── product-discovery/
        ├── component-specs/
        ├── src/
        ├── tokens/
        ├── .storybook/
        ├── docs/
        ├── scripts/
        ├── .github/
        └── .changeset/
```

Порядок отображения задаётся [.order](.order). Временные cache/tmp/tasks создаются в .local/ по потребности, не заготавливаются пустыми папками и очищаются после использования. Старые рабочие копии, экспортированные примеры и история перестройки не являются частью среды.

## Владение

| Место           | Назначение                                                              |
| --------------- | ----------------------------------------------------------------------- |
| agents/         | Канонические TOML ролей; ведущий читает инструкции перед делегированием |
| skills/         | Канонические SKILL.md; выбираются по реестру и контексту                |
| directives/     | Порядок выполнения работы                                               |
| docs/standards/ | Требования к результату                                                 |
| config/         | Машинный реестр маршрутов                                               |
| templates/      | Используемые заготовки и версионированный проектный набор               |
| scripts/        | Исполняемые инструменты и тесты                                         |
| BACKLOG.md      | Наблюдения и будущие улучшения разработчика                             |
| projects/<id>/  | Всё предметное по одной дизайн-системе                                  |
| .local/         | Данные текущей машины и временного выполнения, исключённые из Git       |
| node_modules/   | Восстановимые зависимости private package разработчика                  |
| .git/           | Существующая история репозитория и служебные данные Git                 |

В корне находятся README, AGENTS, ARCHITECTURE, PROCESS, BACKLOG, настройки Node/npm/lint/форматирования/Git, .order и LICENSE. Отдельного корневого журнала перестройки нет.

Скрытых адаптеров .agents/.codex и дублирующих клиентских инструкций нет. Скилл задаёт процедуру; роль становится отдельным исполнителем только при фактическом запуске помощника. Файл роли не меняет sandbox и не предоставляет дополнительные полномочия.

## Организация процедур

AGENTS.md содержит профиль основного ведущего инженера/архитектора; agents/ — канонические роли отдельных исполнителей. PROCESS.md определяет общий маршрут, config/routes.json — соответствие задач, скиллов и процедур. Skills выбирают ветку; директивы описывают выполнение.

Каждая директива следует [общему формату](templates/directive.md) с входами, условиями, этапами, решениями, результатом, проверкой и возвратом. [Project setup](directives/project-setup.md) разворачивает выбранный фундамент после брифа; [code delivery](directives/code-delivery.md) и [Figma delivery](directives/figma-delivery.md) обслуживают выбранные носители; [паритет](directives/figma-parity.md) сравнивает их. Процедуры реализуются ведущим через доступные инструменты, а не выполняются одним только чтением Markdown. Нового дублирующего оркестратора или хранилища задач нет.

## Самостоятельный проект

Каждая папка projects/<id> содержит system.json, Discovery, Spec, документацию и необходимые источники/историю выбранной поставки. Для кодового проекта внутри также находятся собственные package/lock, configs, scripts, Storybook, CI/release-метаданные, исходники и токены. Figma-only не требует React/Storybook-профиля. Нет parent imports/extends, общего npm workspace или общей установки зависимостей.

system.json задаёт id/displayName/platform и стандартные локальные paths. npm-имя и версия берутся из package.json. Профиль AI-PDP-DS не задаёт значения будущим системам. Бриф фиксирует версию фундамента и поставку storybook/figma/both; перечисленные кодовые папки нужны при code-поставке.

[Процедура примитивов](directives/primitive-values.md) хранится в разработчике, реальные значения — только в tokens/primitives выбранного проекта. Матрица отражает источник и предлагаемый diff. Значения могут меняться без перестройки семантики; изменение её контракта требует отдельной задачи. Технический шаблон разворачивается ведущим после брифа.

Product Discovery, Component Specs и src находятся рядом. Общий бриф/исследования/решения — в product-discovery; единственный контракт компонента — component-specs/<id>/spec.md; реализация — src/components/<id>. Последующие работы получают tasks/<task-id> в соответствующей папке. Вложенные Label/Inline Message сохраняют свою семантику.

## Состояние работы

Продуктовая задача использует STATE собственного Markdown-журнала и историю его ревизий. Отдельный state.json не создаётся. Согласование Spec, evidence и приёмка привязаны к текущим хешам; refresh не переисполняет проверки.

Работа над самим разработчиком начинается с записи в BACKLOG и временной задачи .local/tasks/<id>. CLI init требует --object environment; list/resume/check находят только задачи выбранного контекста. После проверенного завершения в согласованной очистке временный журнал удаляется, запись backlog закрывается или удаляется. Это не назначает приёмку продукта.

[CLI журнала](directives/task-state.md) проверяет переходы, token/lock, пути и актуальность источников. Исторические продуктовые receipts не перепривязываются к новому состоянию.

## Инструменты и передача

projects.js создаёт контейнеры и запускает разрешённые локальные команды. templates/project-tooling.json задаёт версию независимого набора, устанавливаемого внутри проекта; обновление отказывает при локальном конфликте и не выполняется скрыто.

prepare-hooks.js устанавливает Husky только при собственном .git. Генерируемая .husky/\_ восстанавливается при установке и не включается в экспорт проекта.

Кодовый export CLI передаёт выбранный проект с относительным source manifest, исключая приватные env, Git, зависимости и временные/генерируемые данные. Получатель устанавливает зависимости и проверяет собственную копию. Для Figma-only передаются целевая библиотека и её проектные материалы; автоматического Figma-only адаптера у CLI нет. [Передача](directives/project-export.md) не означает commit/push или публикацию.

[Ограничения](docs/limitations.md) отделяют автоматические проверки от визуальной приёмки и внешних интеграций.

## Реестр файлов разработчика

Полный запуск и сценарии описаны в [руководстве](docs/environment-guide.md). Следующие таблицы индексируют текущую структуру; процедуры и требования остаются в своих канонических документах.

| Файл/папка                       | Назначение                             |
| -------------------------------- | -------------------------------------- |
| README.md                        | Вход пользователя и быстрый запуск     |
| AGENTS.md                        | Профиль ведущего и правила             |
| ARCHITECTURE.md                  | Структура и владение                   |
| PROCESS.md                       | Маршрут, состояния и приёмка           |
| BACKLOG.md                       | Будущие улучшения                      |
| .nvmrc                           | Версия Node разработки                 |
| package.json                     | Private package, scripts и инструменты |
| package-lock.json                | Воспроизводимая установка инструментов |
| eslint.config.js                 | Lint JavaScript разработчика           |
| .prettierrc.json                 | Форматирование                         |
| .prettierignore                  | Границы форматирования                 |
| .gitignore                       | Исключения секретов/runtime            |
| .order                           | Порядок корневого Explorer             |
| LICENSE                          | Лицензия исходников                    |
| .github/CODEOWNERS               | Владельцы review                       |
| .github/pull_request_template.md | Форма описания изменения               |
| .github/workflows/ci.yml         | Раздельные проверки среды и примера    |
| .husky/pre-commit                | Локальные проверки перед commit        |
| config/routes.json               | Реестр маршрутов                       |
| docs/environment-guide.md        | Установка и сценарии                   |
| docs/limitations.md              | Границы возможностей                   |

### agents

- [agents/ds-library-reader.toml](agents/ds-library-reader.toml) — Роль отдельного исполнителя.
- [agents/ds-researcher.toml](agents/ds-researcher.toml) — Роль отдельного исполнителя.
- [agents/ds-reviewer.toml](agents/ds-reviewer.toml) — Роль отдельного исполнителя.

### skills

- [skills/ds-component/SKILL.md](skills/ds-component/SKILL.md) — ds-component.
- [skills/ds-documentation/SKILL.md](skills/ds-documentation/SKILL.md) — ds-documentation.
- [skills/ds-figma-parity/SKILL.md](skills/ds-figma-parity/SKILL.md) — ds-figma-parity.
- [skills/ds-intake/SKILL.md](skills/ds-intake/SKILL.md) — ds-intake.
- [skills/ds-quality-audit/SKILL.md](skills/ds-quality-audit/SKILL.md) — ds-quality-audit.
- [skills/ds-release/SKILL.md](skills/ds-release/SKILL.md) — ds-release.
- [skills/ds-research-design/SKILL.md](skills/ds-research-design/SKILL.md) — ds-research-design.
- [skills/ds-system/SKILL.md](skills/ds-system/SKILL.md) — ds-system.
- [skills/ds-tokens-themes/SKILL.md](skills/ds-tokens-themes/SKILL.md) — ds-tokens-themes.

### directives

- [directives/briefing.md](directives/briefing.md) — Брифование задачи.
- [directives/code-delivery.md](directives/code-delivery.md) — Кодовая поставка.
- [directives/component.md](directives/component.md) — Компонент: создание, доработка, ремонт.
- [directives/coordination.md](directives/coordination.md) — Скилл и агент: выбор исполнителя.
- [directives/documentation.md](directives/documentation.md) — Документация.
- [directives/environment-checks.md](directives/environment-checks.md) — Диагностика среды.
- [directives/figma-delivery.md](directives/figma-delivery.md) — Figma-поставка.
- [directives/figma-parity.md](directives/figma-parity.md) — Сверка Figma и кода.
- [directives/intake.md](directives/intake.md) — Общий вход в задачу.
- [directives/primitive-values.md](directives/primitive-values.md) — Настройка примитивов проекта.
- [directives/project-export.md](directives/project-export.md) — Передача проекта в отдельную папку или репозиторий.
- [directives/project-setup.md](directives/project-setup.md) — Развёртывание технического проекта.
- [directives/quality-audit.md](directives/quality-audit.md) — Аудит качества.
- [directives/release.md](directives/release.md) — Подготовка выпуска.
- [directives/research-design.md](directives/research-design.md) — Исследование.
- [directives/system.md](directives/system.md) — Создание самостоятельной дизайн-системы.
- [directives/task-state.md](directives/task-state.md) — Журнал задачи.
- [directives/tokens-themes.md](directives/tokens-themes.md) — Токены и темы.
- [directives/verify-deliver.md](directives/verify-deliver.md) — Проверка и передача результата.

### templates

- [templates/brief.md](templates/brief.md) — Бриф: {{id}}.
- [templates/component-spec.md](templates/component-spec.md) — Component Spec: {{component}}.
- [templates/directive.md](templates/directive.md) — Формат рабочей директивы.
- [templates/primitive-matrix.md](templates/primitive-matrix.md) — Матрица примитивов.
- [templates/primitive-request.json](templates/primitive-request.json) — Форма или копируемый проектный инструмент.
- [templates/project/scripts/component-quality.js](templates/project/scripts/component-quality.js) — Форма или копируемый проектный инструмент.
- [templates/project/scripts/component-test.js](templates/project/scripts/component-test.js) — Форма или копируемый проектный инструмент.
- [templates/project/scripts/quality-report.js](templates/project/scripts/quality-report.js) — Форма или копируемый проектный инструмент.
- [templates/project-AGENTS.md](templates/project-AGENTS.md) — Работа с этой дизайн-системой.
- [templates/project-development.md](templates/project-development.md) — Развитие дизайн-системы.
- [templates/project-tooling.json](templates/project-tooling.json) — Форма или копируемый проектный инструмент.
- [templates/system-brief.md](templates/system-brief.md) — Бриф дизайн-системы: {{id}}.

### scripts/environment

- [scripts/environment/check-project.js](scripts/environment/check-project.js) — Проверка локального набора и ссылок самостоятельной системы.
- [scripts/environment/check.js](scripts/environment/check.js) — Проверка реестра, канонических инструкций и маршрутов.
- [scripts/environment/export.js](scripts/environment/export.js) — Экспорт source snapshot с исключениями и manifest.
- [scripts/environment/journal.js](scripts/environment/journal.js) — Markdown STATE, переходы, хеши и evidence.
- [scripts/environment/links.js](scripts/environment/links.js) — Разбор и проверка локальных Markdown-ссылок.
- [scripts/environment/prepare-hooks.js](scripts/environment/prepare-hooks.js) — Установка hooks только при собственном Git.
- [scripts/environment/primitives.js](scripts/environment/primitives.js) — Матрица, план и применение конечных значений примитивов.
- [scripts/environment/project.js](scripts/environment/project.js) — Выбор проекта, metadata и безопасные пути.
- [scripts/environment/projects.js](scripts/environment/projects.js) — CLI коллекции: create, run, install-tooling и export.
- [scripts/environment/request-route.js](scripts/environment/request-route.js) — Подсказка маршрута по обычному запросу.
- [scripts/environment/route.js](scripts/environment/route.js) — CLI выбора процедуры.
- [scripts/environment/tooling.js](scripts/environment/tooling.js) — Установка версионированного проектного набора с проверкой конфликтов.

### scripts/tests

- [scripts/tests/environment-check.test.js](scripts/tests/environment-check.test.js) — Регрессионная проверка инструментов.
- [scripts/tests/journal.test.js](scripts/tests/journal.test.js) — Регрессионная проверка инструментов.
- [scripts/tests/maintenance.test.js](scripts/tests/maintenance.test.js) — Регрессионная проверка инструментов.
- [scripts/tests/primitives.test.js](scripts/tests/primitives.test.js) — Регрессионная проверка инструментов.
- [scripts/tests/project-export.test.js](scripts/tests/project-export.test.js) — Регрессионная проверка инструментов.
- [scripts/tests/tooling.test.js](scripts/tests/tooling.test.js) — Регрессионная проверка инструментов.

### docs/standards

- [docs/standards/accessibility.md](docs/standards/accessibility.md) — Доступность и адаптация.
- [docs/standards/components.md](docs/standards/components.md) — Компоненты React web.
- [docs/standards/documentation.md](docs/standards/documentation.md) — Документация и примеры.
- [docs/standards/figma.md](docs/standards/figma.md) — Figma и соответствие.
- [docs/standards/governance.md](docs/standards/governance.md) — Владение и полномочия.
- [docs/standards/quality.md](docs/standards/quality.md) — Проверки и доказательства.
- [docs/standards/releases.md](docs/standards/releases.md) — Совместимость и выпуск.
- [docs/standards/tokens.md](docs/standards/tokens.md) — Токены и темы.

В projects/ai-pdp-ds находятся все файлы примера: src/components и layouts, src/theme, tokens/primitives и semantic, .storybook, собственные scripts/tests, docs, component-specs, product-discovery, package/lock, configs, .github и .changeset. Их роль и запуск описаны в [README примера](projects/ai-pdp-ds/README.md); каталог компонентов соответствует публичным exports и stories. .git хранит историю этого репозитория; node_modules — восстановимые инструменты; .local — только локальный runtime и временное выполнение.
