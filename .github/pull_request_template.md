## Что и зачем

<!-- Краткое описание изменения и причины -->

## Тип изменения

- [ ] feat — новый компонент или функциональность
- [ ] fix — исправление бага
- [ ] tokens — изменение токенов
- [ ] refactor — рефакторинг без изменения поведения
- [ ] docs — документация
- [ ] chore — инфраструктура, зависимости, конфиги

## Чеклист по правилам ДС (CLAUDE.md)

- [ ] Только `theme.*`, никаких хардкод-значений в стилях
- [ ] Transient props (`$variant`, `$size`) для стилевых пропсов
- [ ] `css` helper из styled-components (не template strings)
- [ ] Варианты через объект-map (не цепочки тернарников)
- [ ] `:focus-visible`, не `:focus`
- [ ] Mobile-first media queries из `theme.breakpoints`
- [ ] Container queries для контентных компонентов (где применимо)
- [ ] Никаких `!important`
- [ ] Storybook story со всеми вариантами + `AllVariants`
- [ ] `.figma.tsx` для Code Connect маппинга (для новых компонентов)
- [ ] Accessibility: ARIA-атрибуты, focus management, keyboard nav
- [ ] WCAG AA контраст
- [ ] Туч-таргет ≥ 44×44px на мобильных
- [ ] Создан Changeset (`npx changeset`) для изменения публичного API

## Скриншоты / Storybook

<!-- Прикрепи скрины из Storybook или ссылку на Chromatic preview -->

## Связано с

<!-- Closes #issue, references Figma node, или другие связи -->

Closes #
Figma: https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=
