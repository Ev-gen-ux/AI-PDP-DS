# Аудит Foundations

Отчёт строится по JSON в `tokens/` и AST исходников `src/components/` и `src/layouts/`. Stories, тесты и Code Connect исключены, чтобы витрина не создавала собственных доказательств использования.

**Прямая ссылка** — полное обращение `theme.*` или CSS `var(...)`. **Кандидат** — динамический ключ или передача ветки темы; это не доказательство использования каждого значения во время выполнения. **Зависимость** — примитив, на который ссылается используемый семантический токен. **Не найдено** — статический анализ не обнаружил ссылок; это не рекомендация удалить токен.

Анализ распознаёт обращения с корнем `theme` и CSS-переменные. Произвольные алиасы, вычисляемые строки и поток данных не отслеживаются. Точное отсутствие использования требует ручной проверки.

Проверено файлов реализации: 130.

| Слой         | Всего | Прямая ссылка | Только кандидаты | Только зависимости | Не найдено |
| ------------ | ----: | ------------: | ---------------: | -----------------: | ---------: |
| borderRadius |     6 |             5 |                0 |                  0 |          1 |
| colors       |   440 |           351 |               49 |                  0 |         40 |
| effects      |     7 |             3 |                0 |                  0 |          4 |
| primitives   |   135 |             0 |                0 |                 78 |         57 |
| spacing      |    53 |            43 |                5 |                  0 |          5 |
| typography   |    31 |            15 |                0 |                  0 |         16 |

## Нет найденных ссылок

- `borderRadius.sectionBase`
- `colors.avatar.statusMark.background.online`
- `colors.avatar.statusMark.border.calm`
- `colors.background.body.calm`
- `colors.background.container.calmest`
- `colors.background.footer.calm`
- `colors.background.global.calm`
- `colors.background.section.calm`
- `colors.background.section.calmest`
- `colors.button.flat.border.focus`
- `colors.button.flat.icon.disabled`
- `colors.button.flat.icon.enabled`
- `colors.button.icon.primary.border.focus`
- `colors.button.icon.secondary.border.focus`
- `colors.button.outline.border.focus`
- `colors.button.outline.icon.disabled`
- `colors.button.outline.icon.enabled`
- `colors.button.primary.background.disabled`
- `colors.button.primary.border.focus`
- `colors.button.primary.icon.disabled`
- `colors.button.primary.icon.enabled`
- `colors.icon.base.calmest`
- `colors.icon.secondary.loud`
- `colors.ink.background.calm.enabled`
- `colors.ink.label.loud.active`
- `colors.ink.label.loud.enabled`
- `colors.ink.label.loud.hover`
- `colors.input._validationMessage.error`
- `colors.input._validationMessage.success`
- `colors.input.border.success`
- `colors.input.cursor.enabled`
- `colors.notification.snackbar.label.secondary`
- `colors.splitButton.primary.button.icon.enabled`
- `colors.splitButton.primary.split.label.disabled`
- `colors.splitButton.primary.split.label.enabled`
- `colors.splitButton.secondary.button.icon.enabled`
- `colors.splitButton.secondary.split.label.disabled`
- `colors.splitButton.secondary.split.label.enabled`
- `colors.toggleButton.primary.background.disabled`
- `colors.toggleButton.primary.icon.disabled`
- `colors.toggleButton.secondary.background.disabled`
- `effects.overlay.content`
- `effects.overlay.drawer`
- `effects.overlay.tooltip`
- `effects.soft.medium`
- `palette.cyan.25`
- `palette.cyan.50`
- `palette.cyan.100`
- `palette.cyan.200`
- `palette.cyan.300`
- `palette.cyan.400`
- `palette.cyan.500`
- `palette.cyan.600`
- `palette.cyan.700`
- `palette.cyan.800`
- `palette.cyan.900`
- `palette.green.25`
- `palette.green.100`
- `palette.green.200`
- `palette.green.600`
- `palette.green.700`
- `palette.green.900`
- `palette.neutral.900`
- `palette.pink.25`
- `palette.pink.50`
- `palette.pink.100`
- `palette.pink.200`
- `palette.pink.300`
- `palette.pink.400`
- `palette.pink.500`
- `palette.pink.600`
- `palette.pink.700`
- `palette.pink.800`
- `palette.pink.900`
- `palette.red.25`
- `palette.red.100`
- `palette.red.200`
- `palette.red.600`
- `palette.red.700`
- `palette.red.900`
- `palette.yellow.25`
- `palette.yellow.100`
- `palette.yellow.200`
- `palette.yellow.400`
- `palette.yellow.600`
- `palette.yellow.700`
- `palette.yellow.900`
- `spacers.18`
- `spacers.36`
- `spacers.64`
- `spacers.72`
- `spacers.96`
- `spacers.128`
- `spacers.256`
- `spacers.512`
- `spacing.grid.columnCount`
- `spacing.grid.columnGap`
- `spacing.grid.rowGap`
- `spacing.height.2xLarge`
- `spacing.height.xLarge`
- `typography.fontFamily.heading`
- `typography.fontFamily.monospace`
- `typography.fontFamily.text`
- `typography.fontSize.heading.h1`
- `typography.fontSize.heading.h2`
- `typography.fontSize.heading.h3`
- `typography.fontSize.heading.h6`
- `typography.fontSize.text.base`
- `typography.fontSize.text.extraSmall`
- `typography.fontSize.text.small`
- `typography.lineHeight.heading.h1`
- `typography.lineHeight.heading.h2`
- `typography.lineHeight.heading.h3`
- `typography.lineHeight.heading.h6`
- `typography.lineHeight.text.base`
- `typography.lineHeight.text.extraSmall`
- `typographyBase.fontFamily.monospace`
- `typographyBase.fontSize.h1`
- `typographyBase.fontSize.h2`
- `typographyBase.fontSize.h3`
- `typographyBase.lineHeight.h1`
- `typographyBase.lineHeight.h2`
- `typographyBase.lineHeight.h3`

## Воспроизведение

`npm run foundations:audit` обновляет этот отчёт. Storybook пересчитывает каталог из исходников при запуске и сборке; после изменения токенов или компонентов перезапустите dev-сервер. Значения нормализуются той же функцией, что использует генератор темы. Исходные токены не меняются.
