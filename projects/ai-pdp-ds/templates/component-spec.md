# Component Spec: {{component}}

<!-- SPEC:DRAFT -->

## 1. Назначение и источник

Сценарий, Figma master/ревизия или согласованный code-first источник; существенные решения и границы.

## 2. API и Variant Matrix

Props/defaults/варианты/состояния по применимости, композиция и вложенные DS-компоненты.

## 3. Numeric Map

Padding T/R/B/L, gap, radius, typography и цепочка источник → токен → resolved value. Неизвестные значения не заполнять предположениями.

## 4. State Token Matrix

Все применимые состояния: background/border/text/icon/geometry. Семантика вложенных компонентов не копируется в родителя.

## 5. Hard Constraints

Неизменяемые свойства, допустимые настройки и совместимость.

## 6. Поведение и доступность

Клавиатура, фокус, labels, errors/loading, темы/адаптация.

## 7. Verification

Методы/команды, входные версии/хеши, дата, pass/fail/not-run/not-applicable, ограничения и решение владельца. Сборка/parse не заменяют визуальную приёмку/публикацию.
