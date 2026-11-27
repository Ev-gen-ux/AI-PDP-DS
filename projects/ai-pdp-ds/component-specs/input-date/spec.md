# Component Spec: InputDate

## 1) Component Kickoff

- **Component:** InputDate
- **Figma:** [inputDate · node 3358:23415](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3358-23415)
- **Stories:** `Default`, `Hover`, `Focus`, `WithValue`, `Invalid`, `Disabled`
- **A11y:** `label` + `htmlFor`, `aria-invalid`, `aria-describedby` при ошибке/подсказке, кнопка календаря `type="button"` и `aria-label`, `:focus-visible` на кнопке, фокус-обводка поля через токен `focus.ring`
- **Done criteria:** 4 файла компонента, экспорт из `src/index.ts`, ThemeCheck, тесты, changeset minor, зелёные format/typecheck/lint/test

## 2) Variant Matrix

| Axis          | Values                                 | Notes                                        |
| ------------- | -------------------------------------- | -------------------------------------------- |
| state         | enabled, hover, focus, error, disabled | Как у Input: без отдельного `success` в сете |
| value         | empty, filled (`YYYY-MM-DD`)           | Пустой — оверлей placeholder                 |
| invalid       | true / false                           | Бордер error + InlineMessage                 |
| calendar icon | trailing 24×24                         | `calendarBlankIconGlyph`                     |

## 3) Numeric Map

| Часть                    | Figma raw   | Token / rule                                 |
| ------------------------ | ----------- | -------------------------------------------- |
| Column gap (label–field) | 8px         | `theme.spacing.paddings.compact`             |
| Field padding horizontal | 16px        | `theme.spacing.paddings.default`             |
| Gap text–icon            | 8px         | `theme.spacing.inner.related`                |
| Min height field         | (как Input) | `theme.spacing.height.large`                 |
| Radius                   | 8px         | `theme.borderRadius.componentBase`           |
| Icon                     | 24×24       | `Icon` `size={24}`                           |
| Border                   | 1px         | `border-width: 1px` + цвета `input.border.*` |

## 4) Figma → Token Map

Ниже — точные пути текущей реализации относительно `theme.colors`, проверенные в исходниках light/dark JSON. Значения Figma в этой правке не измерялись; незаполненные исходные значения не считаются подтверждённым визуальным паритетом.

| Element             | Token                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Field bg            | `input.background.enabled`, `input.background.disabled`                                                           |
| Border              | `input.border.enabled`, `input.border.hover`, `input.border.focus`, `input.border.error`, `input.border.disabled` |
| Field focus ring    | `focus.ring.default`                                                                                              |
| Label               | `input.label.enabled`, `input.label.disabled` — через `Label`                                                     |
| Placeholder / caret | `input.textPlaceholder.enabled`, `input.textPlaceholder.disabled`                                                 |
| Value text          | `input.textPlaceholderValue.enabled`; при disabled — `input.textPlaceholder.disabled`                             |
| Calendar icon       | `input.icon.enabled`; при disabled — `input.textPlaceholder.disabled`                                             |

## 5) State Token Matrix

Пути относительно `theme.colors`; матрица описывает поле и его trailing-иконку, не внутренние элементы календаря. Приоритет вычисляемого состояния: `disabled` → `invalid` (`error`) → focus → hover → enabled. `state` не является публичным prop.

| state    | background                  | border                  | label                  | icon                             |
| -------- | --------------------------- | ----------------------- | ---------------------- | -------------------------------- |
| enabled  | `input.background.enabled`  | `input.border.enabled`  | `input.label.enabled`  | `input.icon.enabled`             |
| hover    | `input.background.enabled`  | `input.border.hover`    | `input.label.enabled`  | `input.icon.enabled`             |
| focus    | `input.background.enabled`  | `input.border.focus`    | `input.label.enabled`  | `input.icon.enabled`             |
| error    | `input.background.enabled`  | `input.border.error`    | `input.label.enabled`  | `input.icon.enabled`             |
| disabled | `input.background.disabled` | `input.border.disabled` | `input.label.disabled` | `input.textPlaceholder.disabled` |

В состоянии focus контейнер дополнительно получает ring `0 0 0 2px` с `focus.ring.default`. Кнопка календаря имеет собственный `:focus-visible` outline через `input.border.focus`; это описание текущего кода, не новая приёмка его доступности. Padding, min-height и radius поля не меняются между состояниями — см. Numeric Map. Placeholder видим только при пустом значении и отсутствии фокуса непосредственно на date input; при заполнении/вводе используется цвет value text из раздела 4.

## 6) Hard Constraints

- Вертикальная структура: label над полем; внутри поля — нативный ввод даты и иконка справа.
- Иконка только `CalendarBlank` из слоя `@/components/icon`.
- WebKit-индикатор нативного календаря скрыт через `::-webkit-calendar-picker-indicator`. Кнопка переключает собственный popover, отрисованный порталом в `document.body`; `showPicker` не вызывается.
- Значение в DOM: `YYYY-MM-DD`; отображение зависит от браузера.
- Без оси `appearance` / `size` вне макета.

### Текущее поведение календаря

Кнопка открывает вид дней `DatePicker`. Меню в заголовке переключает виды дня, месяца (`MonthPicker`) и года (`YearPicker`). Выбор года переводит к месяцам, выбор месяца — к дням; выбор дня записывает ISO-значение через `onChange` и закрывает popover. Кнопка, Escape и нажатие мышью вне поля/панели закрывают его. `disabled` блокирует input и кнопку. Поддерживаются controlled `value` и uncontrolled `defaultValue`; локаль календаря по умолчанию `ru-RU`, начало недели — понедельник (`weekStartsOn={1}`).

Это сверка существующего поведения по коду, stories и тесту открытия, а не новая спецификация браузерных ограничений или подтверждение всех клавиатурных сценариев. Для анатомии календаря см. [DatePicker Spec](../date-picker/spec.md).

## 7) Verification

- [x] Историческая отметка паритета состояний с мастер-сетом (enabled/hover/focus/error/disabled); в текущей правке повторно не подтверждалась.
- [x] `Default` story с controls без принудительного pseudo-state
- [x] Иконка: Phosphor через `calendarBlankIconGlyph`, размер 24 для поля высоты `large`
- [x] `InputDate.figma.tsx` с `nodeId: 3358:23415`
- [ ] Ручная визуальная сверка в Storybook с Figma (выполняет автор PR)

### Сверка документации — 26 ноября 2026

Источники: [реализация и props](../../src/components/input-date/InputDate.tsx), [stories](../../src/components/input-date/InputDate.stories.tsx), [существующие тесты](../../src/components/input-date/InputDate.test.tsx), [Label](../../src/components/label/Label.tsx), [light](../../tokens/semantic/colors.light-theme.json) и [dark](../../tokens/semantic/colors.dark-theme.json) семантика. База исходников: `cc58d2b`; правка затрагивает только этот Spec.

Подтверждено чтением исходников: собственный календарь вместо `showPicker`, структура label/field, приоритет состояний и точные пути токенов. Существующий тест явно ожидает открытие собственного календаря; тесты в этой документационной задаче не запускались и не добавлялись. Проверены форматирование, локальные ссылки и наличие перечисленных цветовых токенов в обеих темах.

Визуальная сверка с актуальным Figma, браузерные взаимодействия, полнота доступности и публикация Code Connect не проверялись. `InputDate.figma.tsx` содержит metadata mapping; наличие файла не подтверждает опубликованный Code Connect. Numeric Map сохранена без новых замеров и без утверждения прежних чисел. Изменений API, поведения, токенов, stories и CI нет. Документ подготовлен к review владельца; приёмка текущей версии не подменяется историческими галочками.
