# Design System Developer

Самостоятельная AI-среда проектирования, разработки и сопровождения дизайн-систем. Она объединяет брифование, исследования, спецификации компонентов, токены, React/TypeScript, styled-components, Storybook и Figma. В projects/ai-pdp-ds находится рабочий самостоятельный пример библиотеки, а не исходники самого разработчика.

## Начать работу

Нужны Node 22 и npm 10.9+. После клонирования этого репозитория:

```sh
git clone https://github.com/Ev-gen-ux/AI-PDP-DS.git design-system-developer
cd design-system-developer
npm ci
npm run env:check
npm test
```

Откройте корень в AI-клиенте и задайте задачу с указанием AGENTS.md. В Work Environment команда «Запусти разработчик дизайн-систем» открывает тот же процесс. Ведущий сам выбирает скилл, задаёт необходимые вопросы и ведёт задачу; пользователь не обязан знать CLI.

## Запустить пример AI-PDP-DS

```sh
cd projects/ai-pdp-ds
npm ci
npm run tokens:build
npm run storybook
```

Storybook обычно доступен на http://localhost:6006; используйте фактический адрес из терминала. Для production-сборок: npm run build и npm run storybook:build. Секреты внешних сервисов не нужны для локального запуска.

[README примера](projects/ai-pdp-ds/README.md) · [Подключение библиотеки и темы](projects/ai-pdp-ds/docs/library-setup.md) · [Конвенции](projects/ai-pdp-ds/docs/library-conventions.md).

## Устройство и процесс

- [AGENTS](AGENTS.md) — роль ведущего инженера/архитектора и обязательные правила.
- [ARCHITECTURE](ARCHITECTURE.md) — папки, файлы, границы владения и самостоятельные проекты.
- [PROCESS](PROCESS.md) — жизненный цикл, решения, состояния и проверки.
- [Руководство](docs/environment-guide.md) — установка, вызовы, сценарии и передача.
- [Ограничения](docs/limitations.md) — что реально автоматизировано и какие проверки выполняются отдельно.
- [BACKLOG](BACKLOG.md) — будущие улучшения разработчика.

Путь новой системы: контейнер → достаточный бриф → версия фундамента → развёртывание → согласованные примитивы → Component Spec → выбранная поставка → проверка/review → приёмка. Ремонт и аудит используют соответствующие сокращённые ветки. Storybook, Figma и both выбираются в брифе. Общий фундамент сохраняет семантику; меняются согласованные конечные значения примитивов и шрифтов.

## Команды разработчика

```sh
npm run env:route -- --request "Исправь баг в InputPassword"
npm run env:project -- list
npm run env:project -- create bank-ds --name "Bank DS"
npm run env:task -- list --project ai-pdp-ds
npm run env:project -- run ai-pdp-ds build
npm run lint
npm run format:check
```

Create создаёт только Discovery-контейнер; install-tooling — независимые инструменты процесса. Полный технический шаблон выбирает и разворачивает ведущий после брифа. Скиллы читаются из skills/, роли отдельных исполнителей — из agents/ по config/routes.json. Клиентское автообнаружение не требуется.

## Самостоятельность и передача

Корневой package — private инструменты среды. AI-PDP-DS имеет собственные package/lock, зависимости, токены, Storybook, документацию и историю. Её npm identity @evgeni_design_84/ai-pdp-ds сохраняется. Публикация корневого разработчика не является выпуском npm-пакета библиотеки.

Для отдельного кодового проекта: env:project export ai-pdp-ds --out <новая-папка-вне-разработчика> по [процедуре передачи](directives/project-export.md). Figma-only передаётся через [свою процедуру](directives/figma-delivery.md), без кодового export CLI. Иконки и графики остаются отдельными средами и не запускаются автоматически.

Порядок Explorer задаётся .order и установленным ExplorerSorter; на работоспособность CLI визуальная сортировка не влияет. Локальные .local/toolchains, зависимости, секреты и одноразовые результаты в репозиторий не входят. [Лицензия](LICENSE).
