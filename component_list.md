# Component List

Базовый набор компонентов библиотеки (в алфавитном порядке). Сверено с верхним уровнем `src/components/` и публичными экспортами `src/index.ts`. Папка **`theme-check`** в компонентах не входит в продуктовый список (служебный сценарий Storybook).

**Обновлено:** 2026-05-06.

всего 56  
готово 49  
осталось 7

- ✅ `Accordion`
- ✅ `Avatar`
- ✅ `BenefitCard`
- ✅ `Breadcrumbs`
- ✅ `Button`
- ✅ `ButtonIcon`
- ✅ `ButtonLink`
- ✅ `Checkbox`
- ✅ `Chips`
- ✅ `Counter`
- ✅ `DatePicker` (вкл. `MonthPicker`, `YearPicker`)
- ✅ `Divider`
- ✅ `DropdownItem`
- ✅ `DropdownList`
- ✅ `FileUpload`
- ✅ `Icon`
- ✅ `InlineMessage`
- ✅ `InputDate`
- ✅ `InputEmail`
- ✅ `InputFile`
- ✅ `InputSearch`
- ✅ `InputTel`
- ✅ `InputText`
- ✅ `Label`
- ✅ `Modal` (вкл. `ModalDialog`, `ModalFooterActions`, `ModalButtonClose`)
- ✅ `NotificationSnackbar`
- ✅ `Pagination`
- ✅ `ProgressBar`
- ✅ `Radio`
- 🛠️ `Select/MultiSelect`
- ✅ `SelectButton`
- ✅ `Sidebar`
- ✅ `SidebarNavigationItem`
- 🛠️ `Skeleton`
- ✅ `Spinner`
- ✅ `SplitButton`
- ✅ `StatusLabel`
- ✅ `StatusMark`
- 🛠️ `Stepper`
- 🛠️ `Switcher`
- ✅ `TabGroup`
- ✅ `TabItem`
- ✅ `TableCellBadge`
- ✅ `TableCellEmptyState`
- ✅ `TableCellInlineEdit`
- ✅ `TableCellSingleChoice`
- ✅ `TableCellSlotCentered`
- ✅ `TableCellSlotLeftAligned`
- ✅ `TableCellSplitButton`
- ✅ `TableCellTextContent`
- ✅ `TableColumn`
- ✅ `TableRow`
- 🛠️ `Textarea`
- ✅ `ToggleButton`
- 🛠️ `Tree`
- 🛠️ `Tooltip`

## Layout-примитивы (`src/layouts/`)

Не входят в счётчик 56 выше. В репозитории:

- ✅ `Cluster`
- ✅ `Grid`
- ✅ `Stack`

По дорожной карте CLAUDE в **`src/layouts/`** ещё нет примитивов: **`Sidebar`** (двухколоночный layout), **`Container`**, **`Center`**, **`Switcher`**. Компонент **`Sidebar`** в `src/components/sidebar` — отдельная UI-молекула (область навигации), это не тот же примитив, что layout-`Sidebar` из списка выше.
