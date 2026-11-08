# Подключение и проверка библиотеки

## Локальный запуск

```bash
nvm use
npm ci
npm run tokens:build
npm run storybook
```

Figma и Chromatic не нужны для запуска из сохранённых JSON. При первом запуске необходим доступ к npm для установки зависимостей.

## Проверка перед выпуском

```bash
npm run quality:report
```

Команда последовательно выполняет проверки токенов, типов, линтера, форматирования, тестов с покрытием, инструментов, сборки библиотеки, установленного архива, Storybook и шаблонов Code Connect. Неуспех любого шага возвращает ненулевой exit code, но остальные проверки продолжаются для полного отчёта.

Результаты: `.local/quality/report.md`, `report.json` и журналы команд. GitHub workflow **Quality report** запускает ту же команду в PR и после обновления `main`; сводка видна в Summary запуска, отчёт и coverage доступны в артефакте `quality-report`. Бот не публикует комментарии и не меняет исходники.

`npm run package:check` требует готового `dist/`. Он создаёт архив, устанавливает его в отдельный проект с peer-зависимостями, проверяет TypeScript, ESM/CJS, SSR и сборку Vite с CSS. Результаты и путь проекта сохраняются в `.local/package-check/latest.json`. Эта проверка использует версии peer-зависимостей текущего проекта и не заменяет матрицу всех заявленных версий React.

## Установка из архива

Подтверждённое имя пакета: `@evgeni_design_84/ai-pdp-ds`. До публикации в npm его можно передать как архив:

```bash
npm pack
# В приложении-потребителе:
npm install /путь/к/evgeni_design_84-ai-pdp-ds-1.0.0.tgz react react-dom styled-components
```

Имя архива соответствует текущей версии `package.json`. `npm pack` запускает `prepack` и собирает свежую библиотеку.

```tsx
import { ThemeProvider } from 'styled-components';
import { Button } from '@evgeni_design_84/ai-pdp-ds';
import { theme } from '@evgeni_design_84/ai-pdp-ds/theme';
import '@evgeni_design_84/ai-pdp-ds/theme/variables.css';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <div data-theme="light">
        <Button text="Продолжить" />
      </div>
    </ThemeProvider>
  );
}
```

CSS содержит обе темы, адаптивную типографику и шрифты Inter/Geologica. Для тёмной темы используйте `data-theme="dark"`. Генерируемый CSS необходим, поскольку значения `theme` ссылаются на CSS-переменные. Импорт из `theme` также подключает декларацию расширения DefaultTheme для styled-components.

## Публикация npm

Workflow **Publish npm package** запускается вручную из `main`. Нужно указать точную версию `package.json`; по умолчанию выполняется только проверка. Для публикации включите input `publish`.

Перед настоящим выпуском нужны доступ к npm scope `@evgeni_design_84`, доступное имя и версия пакета, а также аутентификация: настроенный trusted publisher для этого репозитория и файла `npm-publish.yml` либо секрет `NPM_TOKEN` с правами публикации. Environment workflow — `npm-release`. В своём fork замените имя пакета и метаданные на собственные.

Trusted publishing требует подходящих версий npm и Node; отдельный workflow использует Node 24. Подробнее: [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/). Для первого выпуска может потребоваться настройка со стороны владельца npm-аккаунта. Создание workflow само по себе не публикует пакет.

## Токены Figma

Скопируйте `.env.example` в `.env.local` и укажите свой Figma file key и токен. `tokens:pull` и `tokens:push` читают `.env.local`, затем `.env`; уже заданные переменные окружения имеют приоритет.

```bash
npm run tokens:pull
npm run tokens:build
# Только получить и сохранить план:
npm run tokens:push
# Применить, после просмотра .local/figma/sync-plan.json:
npm run tokens:push:apply
```

Push читает актуальные локальные Variables через API, сопоставляет коллекции, режимы и имена, сохраняет существующие идентификаторы и создаёт отсутствующие сущности. Удаления не выполняются. Неверные ссылки, циклы aliases и несовместимые типы блокируют отправку. JSON в `.local/figma/sync-plan.json` содержит значения токенов: учитывайте это при передаче отчётов.

Доступ к [Variables REST API](https://developers.figma.com/docs/rest-api/variables-endpoints/) зависит от плана Figma; для чтения нужен `file_variables:read`, для записи — `file_variables:write` и права редактирования файла. Токен, проверенный в этой сессии, не имеет read-scope; поэтому реальная синхронизация не подтверждена.

Токены типа `shadow` не являются Variables: планировщик сообщает, что они пропущены. Для них нужен отдельный механизм Figma effect styles. Скрипт не является синхронизацией всех видов Figma styles.

Для проверки без Figma можно использовать сохранённый ответ GET local variables:

```bash
npm run tokens:push -- --snapshot /путь/к/snapshot.json
```

Snapshot должен содержать `variables` и `variableCollections` либо исходный ответ API с `meta`. Режим `--apply` не принимает snapshot: запись требует свежего чтения. GitHub workflow **Sync Tokens to Figma** запускается вручную, по умолчанию создаёт план. Наличие плана не подтверждает успешную запись в Figma.

## Code Connect

`ButtonCodeConnect.figma.ts` содержит новый шаблон для опубликованного набора `button` (`205:3332`). Старые `.figma.tsx` оставлены как исторические заготовки, но не участвуют в публикации. `figma.config.json` включает только новые `.figma.ts`.

```bash
npm run figma:check
npm run figma:publish
```

Первая команда проверяет распознавание непустого набора шаблонов. Тесты инструментов проверяют генерацию сниппета Button для всех appearance и размеров, disabled/loading, реальных состояний браузера и динамически заменяемых иконок. Это не подтверждает публикацию или визуальное соответствие всех компонентов.

Code Connect доступен на Professional (одна активная библиотека и один фреймворк), Organization и Enterprise при подходящем типе места и доступе. MCP в этой сессии отклонил подключение с сообщением об ограничении плана, но проверка через CLI прошла: Button валидирован и успешно опубликован для React с существующим токеном. Ответ MCP не следует считать окончательной проверкой доступности всего сервиса. [Документация Code Connect](https://developers.figma.com/docs/code-connect/).

Остальные компоненты нужно сопоставлять с актуальными опубликованными мастер-узлами по одному; старые node IDs нельзя автоматически считать правильными.
