# Конвенции AI-PDP-DS

Это профиль существующей React-библиотеки, не значения для любой новой дизайн-системы. Источник точных свойств — принятый Spec и исходники. Код/токены при переносе инструкций не менялись.

## API и токены

Профиль использует appearance/size, boolean disabled/loading/invalid/readOnly, status, IconName для iconBefore/iconAfter; text/children/label/description по назначению. Legacy primary/outline/flat/secondary, small/medium/large и success/information/alert/wait/error — примеры текущих осей, не разрешение добавить их к каждому компоненту.

Семантические имена согласуются с Figma. Палитра/spacing/radius/типографика читаются из tokens; spacing использует inner/outer/paddings/height/grid, radius — componentInner/componentBase/sectionInner/containerBase/sectionBase/rounded. Цвета light/dark, типографика XL/MD/XS; значения не копируются из старого текста.

Focus использует colors.focus.ring.default и один ring 0 0 0 2px; не дублировать outline/shadow. Breakpoints текущего профиля xs=480/md=768/xl=1280 проверяются по исходникам. Адаптивная типографика — CSS variables/media, а не JS rerender.

## Storybook

Autodocs, описания API/props и интерактивная Default первой. Далее appearance-примеры с применимыми состояниями; forced states отдельно. Алфавитная сортировка en-US, Components/Name и Foundation/Name без числовых префиксов.

Decorator примера: padding 24px. Для принятого фиксированного примера поля — 24px 0 24px 24px и ширина 320px; это оформление демонстрации, не токены компонента. Не растягивать без причины и не задавать docs.story.height ради лишнего scroll. ThemeCheck обновляется по затронутым состояниям.

## Icon-потребители

Использовать существующий Icon-слой, без прямого Phosphor import/SVG-path в потребителе. IconSize и size map сверяются с API/Spec; текущий профиль 16/24, пример соответствия 48→24 и 32→16 не заменяет master. Не вводить 20px по старому примеру. Неизвестный смысл/fallback фиксируется как вопрос, существующее поведение не меняется в ходе консолидации. Новые наборы/генераторы отдельно исключены из scope.

## Источники

[Подключение](library-setup.md), действующие Component Spec, tokens и src. Ручной component_list не является источником актуальной приёмки. Browser-check InputPassword исключён владельцем; Combobox отменён. Эти решения не превращаются в новые выполненные тесты.
