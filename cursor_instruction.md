# Cursor Instruction · AI-PDP-DS

> Этот файл — **онбординг и дорожная карта для Cursor (или другого AI-агента)** по репозиторию AI-PDP-DS: что уже есть, что обычно делать дальше, и в каком порядке безопасно резать задачи на PR.
> Правила, naming, архитектура и гейты качества зафиксированы в [`CLAUDE.md`](./CLAUDE.md). **Этот файл их не дублирует** — он задаёт **контекст и порядок действий**.
>
> **Перед работой над кодом — прочитай `CLAUDE.md` целиком.** Это контракт. Все решения здесь опираются на него.

**Политика документов:** [`CLAUDE.md`](./CLAUDE.md) — **единственный основной контракт**; в типовых задачах агентов и контрибьюторов его **не менять** (изменения только у владельца дизайн-системы и отдельным согласованным PR). Всё, что нужно уточнить по процессу, онбордингу Cursor, дорожной карте и чеклистам без смены контракта, вносится **сюда** — в **`cursor_instruction.md`**.

---

## 0. Контекст для Cursor

- **Репозиторий:** https://github.com/Ev-gen-ux/AI-PDP-DS
- **Figma (токены и компоненты):** https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS
- **Стек:** React 18/19 · TypeScript 5 · Vite · styled-components 6 · Storybook 8 · Style Dictionary · Figma Code Connect
- **Текущее состояние (2026-05):** библиотека **в активной разработке**: в `/tokens` лежат DTCG JSON, `npm run tokens:build` генерирует артефакты темы; в `src/components/` и `src/layouts/` — большой набор компонентов и примитивов. Актуальный список и статусы — **[`component_list.md`](./component_list.md)** (числа «готово / осталось» там же).

### Базовая готовность продукта (проверка здоровья, не разовый «финиш»)

Регулярно (локально и в CI) должны быть зелёными:

1. `npm run tokens:build` — Style Dictionary без ошибок (после правок в `/tokens/**`).
2. `npm run typecheck` — 0 ошибок.
3. `npm run lint` — 0 ошибок и 0 warnings.
4. `npm run test` — все тесты зелёные.
5. `npm run format:check` — Prettier (см. `CLAUDE.md` 0.4).
6. `npm run storybook` — dev на **:6006**; вводная MDX: **`docs/Introduction.mdx`**.
7. `npm run build` — сборка `dist/` (перед релизом / по CI).
8. PR: ветка не `main`, changeset при изменении публичного API, ThemeCheck при новых/изменённых интерактивных компонентах (`CLAUDE.md` 14.7).

Опционально по задаче: `npm run tokens:pull`, `npm run figma:publish`, Chromatic — если настроены секреты и workflow.

---

## 1. Настройка Cursor (один раз на машину / проект)

### 1.1 Подключить Figma MCP в Cursor

Settings → MCP → Add server, пример:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Дальше — OAuth в Figma. **Зачем:** `get_design_context`, переменные, библиотека, контекст для компонентов без ручного копирования пикселей.

### 1.2 Правила в Cursor (рекомендуется)

**Вариант A (актуальный Cursor):** Project Rules в **`.cursor/rules/`** (или настройки Rules в UI) — короткий список: читать `CLAUDE.md`, **не править `CLAUDE.md`** в типовых задачах; при необходимости этот файл (`cursor_instruction.md`); ветки `feat/*` / `fix/*` / `tokens/*`; 4 файла на компонент; только токены из `theme`; Figma MCP для макетов.

**Вариант B (legacy):** файл **`.cursorrules`** в корне — Cursor может подхватывать его в зависимости от версии; содержимое может дублировать вариант A.

Пример текста (вставить в rule или `.cursorrules`):

```
Проект AI-PDP-DS — дизайн-система. Перед изменением кода:
1. Прочитай CLAUDE.md — обязательный контракт; не редактируй CLAUDE.md без владельца ДС.
2. При онбординге / крупных задачах опирайся на cursor_instruction.md (его можно дополнять).
3. Не коммить в main напрямую; ветки feat/* fix/* tokens/*.
4. Новый компонент: Component.tsx, Component.stories.tsx, Component.figma.tsx, index.ts.
5. Стили: theme.*, transient $props, css из styled-components, map-объекты для вариантов.
6. Figma: MCP или согласованный процесс sync токенов.
7. Неясности — уточнение у владельца задачи / в PR, не угадывать.
```

### 1.3 Локальные секреты

`.env.local` (в `.gitignore`), пример:

```bash
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FIGMA_FILE_KEY=i7T3ru2M0SyXgJeTda8f43
```

Scopes для PAT — см. `CLAUDE.md` §15.2 или документацию Figma для ваших workflow.

---

## 2. Защита репозитория (владелец, не агент)

Через GitHub UI: branch protection на `main`, Secrets (`FIGMA_*`, `CHROMATIC_*`, `NPM_TOKEN` при публикации), при необходимости Environment для опасных операций с Figma. Подробности — **`CLAUDE.md` §15**.

---

## 3. Что уже закрыто и что брать в следующие PR

Исторические этапы «с нуля» (первый pull токенов, первый `tokens:build`, эталонный Button только с плейсхолдером и т.д.) **в основном пройдены**. Ниже — **актуальный** ориентир, не линейный обязательный чеклист.

### Уже есть (не начинать «с нуля»)

- Конвейер токенов: `scripts/` + `npm run tokens:build` / при необходимости `tokens:pull`.
- Сгенерированная тема (часть файлов в `src/theme/` может быть в `.gitignore` — не править руками сгенерированное).
- Много атомов/молекул, Storybook, тесты, Code Connect-файлы у компонентов.
- Layout-примитивы **`Stack`**, **`Cluster`**, **`Grid`** в `src/layouts/`.

### Ближайший бэклог (сверяйся с `component_list.md` и §13 `CLAUDE.md`)

- Компоненты в доработке по списку: например **`Skeleton`**, **`Textarea`**, **`Tooltip`**, **`Tree`** (статус 🛠️ в `component_list.md`).
- Layout из дорожной карты **`CLAUDE.md`**, которых ещё нет в `src/layouts/`: **layout-`Sidebar`** (двухколоночный примитив), **`Container`**, **`Center`**, **`Switcher`** (горизонталь ↔ вертикаль). UI-**`Sidebar`** в `src/components/sidebar` уже есть и **не** заменяет layout-примитив. Не путать layout-**`Switcher`** с UI-**`Toggle`** в `src/components/toggle` — разные сущности.

### Типичный workflow одной задачи (компонент или токены)

1. Протокол из **`CLAUDE.md` §0** (kickoff, spec, gates — что применимо к задаче).
2. Ветка `feat/<name>` / `fix/<name>` / `tokens/<name>`.
3. Реализация + stories + при необходимости `.figma.tsx` + экспорт + ThemeCheck + `component_list` при новом публичном компоненте.
4. `npm run format`, `format:check`, `typecheck`, `lint`, `test`, `build` по политике PR.
5. Changeset при изменении публичного API (`CLAUDE.md` §14.6, §18).

### Долгий хвост (по согласованию)

- **Push токенов в Figma** (`figma-tokens-push` / Variables REST API) — сложная зона; пока достаточно pull + правки JSON в репо по процессу команды.
- **Chromatic** — если подключён в CI; иначе см. workflow репозитория.

---

## 4. Что агент НЕ делает без явного запроса

- Редактировать **`CLAUDE.md`** (контракт меняет только владелец ДС; процедурные правки — в **`cursor_instruction.md`**).
- Менять branch protection, Secrets, настройки GitHub.
- Пушить в `main`, обходить review.
- Писать в Figma Variables «в прод» без согласования.
- Вносить хардкод вместо токенов, `any`, игнорировать `CLAUDE.md`.
- Менять публичный API без `major` / changeset по правилам semver проекта.

---

## 5. Если что-то непонятно

**Не угадывать.** Issue или комментарий в PR. Спорные места — **`CLAUDE.md` §16** (известные опечатки в именах Figma), §0.2.1 (Clarification Gate).

| Ситуация                        | Действие                                                              |
| ------------------------------- | --------------------------------------------------------------------- |
| Опечатка в имени токена в Figma | Исправить в Figma → pull / синк по процессу                           |
| Нужен новый семантический токен | JSON в `/tokens` + `tokens:build`, не литерал в компоненте            |
| Расхождение макет ↔ код         | Приоритет master-node Figma (`CLAUDE.md` 0.2.3)                       |
| Правка контракта (`CLAUDE.md`)  | Только владелец ДС + отдельный согласованный PR; агентам — не править |

---

## 6. Чеклист перед PR (скопировать в описание PR)

```markdown
- [ ] Сверился с CLAUDE.md по типу задачи (компонент / токены / chore)
- [ ] Ветка не main; коммиты по смыслу (Conventional Commits)
- [ ] Новый компонент: 4 файла (tsx, stories, figma, index) + экспорт + ThemeCheck при необходимости
- [ ] Только theme.\* / CSS variables из темы, без хардкода цветов/размеров
- [ ] Transient $props для стилей; :focus-visible; a11y по §9
- [ ] Stories по §10 (Default + демо; без лишнего форса состояния в Default)
- [ ] npm run format && npm run format:check
- [ ] npm run lint — 0 warnings
- [ ] npm run typecheck
- [ ] npm run test
- [ ] npm run build — если требуется для PR/CI
- [ ] Changeset при изменении публичного API
- [ ] Описание PR по шаблону репозитория
```

---

## 7. Ссылки

- **[`CLAUDE.md`](./CLAUDE.md)** — контракт
- **[`component_list.md`](./component_list.md)** — прогресс компонентов
- **Figma:** https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS
- **Style Dictionary:** https://styledictionary.com/
- **Code Connect:** https://www.figma.com/code-connect-docs/
- **Cursor MCP:** https://docs.cursor.com/context/model-context-protocol

---

**Версия инструкции:** 2.0.1  
**Назначение:** онбординг и дорожная карта; **обязательный** для merge остаётся **`CLAUDE.md`** + CI и политика репозитория. Редактировать в обычных задачах можно **только этот файл** (`cursor_instruction.md`), не контракт.
