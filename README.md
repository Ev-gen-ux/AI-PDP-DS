# AI-PDP-DS

Дизайн-система на React + TypeScript + styled-components с двунаправленной синхронизацией с Figma.

## Стек

- React 18/19 · TypeScript 5 · Vite 6
- styled-components 6
- Storybook 8 + Chromatic для visual regression
- Style Dictionary 5 для трансформации токенов
- Figma Code Connect + Variables REST API для синхронизации
- Changesets для версионирования

## Быстрый старт

```bash
git clone https://github.com/Ev-gen-ux/AI-PDP-DS.git
cd AI-PDP-DS
nvm use            # Node 20 (см. .nvmrc)
npm install
npm run tokens:build
npm run storybook  # http://localhost:6006
```

## Структура

```
/tokens          ← W3C DTCG JSON, источник правды для токенов
/src
  /theme         ← сгенерировано Style Dictionary, не редактировать
  /components    ← атомы (Button, Icon, Input...)
  /patterns      ← молекулы (NotificationSnackbar, BenefitCard...)
  /layouts       ← Stack, Cluster, Grid, Sidebar
  /templates     ← каркасы экранов
/scripts         ← Style Dictionary config, Figma sync утилиты
/.github         ← CI/CD, CODEOWNERS, PR template
/docs            ← MDX-документация и спецификации
CLAUDE.md        ← контракт для AI-агентов и разработчиков
```

## Правила работы

Полный контракт по работе с дизайн-системой описан в [CLAUDE.md](./CLAUDE.md).
Перед любым PR — пройти чеклист из шаблона PR.

## Команды

| Команда                       | Назначение                                |
| ----------------------------- | ----------------------------------------- |
| `npm run dev`                 | Vite dev-server (для песочницы)           |
| `npm run storybook`           | Storybook на :6006                        |
| `npm run tokens:build`        | Style Dictionary → CSS + TS + Figma JSON  |
| `npm run tokens:pull`         | Подтянуть переменные из Figma в `/tokens` |
| `npm run tokens:push`         | Залить токены в Figma Variables           |
| `npm run build`               | Собрать библиотеку в `/dist`              |
| `npm run lint` / `lint:fix`   | ESLint                                    |
| `npm run typecheck`           | TypeScript проверка                       |
| `npm run test` / `test:watch` | Vitest                                    |
| `npm run figma:publish`       | Опубликовать Code Connect в Figma         |
| `npm run changeset`           | Создать changeset перед PR                |

## Лицензия

MIT
