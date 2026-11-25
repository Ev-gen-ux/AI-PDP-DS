# Требования к компонентам

Обязательный стандарт для React-библиотеки. Версии и поддержанные диапазоны читать в package.json и lockfile; текстовый пример не меняет публичный API.

## Структура и API

Каждый новый компонент: Component.tsx, Component.stories.tsx, Component.figma.tsx, index.ts; публичные экспорты через src/index.ts. Правило четырёх файлов сохраняется; исключение и основание отсутствия mapping согласуются явно. Не удалять существующие mappings как часть переноса инструкций.

Props строго типизированы; публичные типы экспортируются. Не использовать неограниченный any, @ts-ignore и иные обходы ошибок TypeScript. Стили используют transient props с $ и не передают их в DOM. Выполнять typecheck до продолжения зависимой реализации; нарушение описать как TYPE SAFETY VIOLATION с планом исправления.

Именование API:

- appearance — визуальный вариант; size — размер.
- disabled, loading, invalid, readOnly — boolean состояния.
- status — смысловой статус; iconBefore/iconAfter — IconName.
- text или children — содержимое; label — лейбл; description — описание.
- variant/kind/type для визуального варианта, theme/mode для этой роли не вводить.
- Типовые значения legacy API: appearance primary/outline/flat/secondary, size small/medium/large, status success/information/alert/wait/error. Точные значения осей определяет согласованный Spec/Figma. Строковые Figma-варианты сохраняются в story/Code Connect mapping 1:1; не упрощать их без согласования.

Новый публичный prop требует основания в мастер-компоненте либо явного согласования. Не создавать compound API для простого элемента; составной Modal.Header допустим по анатомии задачи.

## Стили

1. Только семантические theme.\* / CSS variables; не подставлять палитру напрямую, литеральные цвета, размеры или радиусы вместо токенов.
2. styled-components, css helper и объектные maps вариантов с контролем полноты. Не менять библиотеку стилизации без согласования.
3. Transient $props, :focus-visible, единый focus token. Никакого !important.
4. Mobile-first media queries через theme.breakpoints; container queries по применимости.
5. Новые значения сначала в исходниках токенов по согласованному процессу, затем tokens:build. Сгенерированные файлы вручную не редактируются.

Обязательны [токены](tokens.md), [доступность](accessibility.md), [иконки](icons.md), [документация](documentation.md), [Figma](figma.md) для соответствующих поставок и [качество](quality.md). Изменение поведения учитывается в [версионировании](releases.md).
