# Журнал задачи

## Назначение и запуск

Использовать при создании/продолжении задачи и существенных изменениях её состояния. Единственное текущее состояние — STATE своего \_process_log.md; отдельный state.json не создаётся.

## Входы

Выбранные проект и задача, brief/Spec/inputs, решения владельца и результаты проверок. Корневая первая задача — product-discovery, компонентная — component-specs/<id>, последующие работы — tasks/<task-id> соответствующей папки. Один Spec остаётся общим.

## Условия начала

Перед изменением прочитать актуальный журнал. TOKEN берётся из последнего resume, задачу нельзя выбирать по mtime. Продуктовые операции из разработчика требуют --project; локальный --root выбирает папку проекта.

## Этапы

1. Создать или восстановить задачу:

```sh
npm run env:task -- init add-password --project ai-pdp-ds --component input-password
npm run env:task -- list --project ai-pdp-ds
npm run env:task -- resume add-password --project ai-pdp-ds
npm run env:task -- check add-password --project ai-pdp-ds
npm run env:task -- refresh add-password --project ai-pdp-ds --expect TOKEN
npm run env:task -- approve-spec add-password --project ai-pdp-ds --expect TOKEN --note "Owner approved current Spec"
npm run env:task -- update add-password --project ai-pdp-ds --expect TOKEN --patch -
```

2. Init принимает --action, --object, --title и компонент по задаче; актуальные опции — --help. Patch — JSON через stdin или --patch <file>. Для известного переходного журнала доступен --journal <relative-path>.
3. Для работы над самой средой: init <id> --object environment --action refine из её корня, затем list/resume/check <id> без проекта. Временный журнал — .local/tasks/<id>; необязательный --journal должен соответствовать этому ID. Начатое/будущее улучшение среды учитывается в [BACKLOG](../BACKLOG.md).
4. Заполнять STATE: scope, brief/spec/input references с SHA256, questions/decisions, evidence, exceptions, specApproval, acceptance и nextStep. Значения сериализованы JSON внутри Markdown; человеческий текст вне блока сохраняется.
5. Переходить discovery → ready → implementation → review → accepted. Ready требует заполненного brief без BRIEF:DRAFT, достаточного scope/nextStep и отсутствия блокирующих вопросов. Новый/изменённый Component Spec принимается через approve-spec текущего хеша до реализации. Ремонт в принятых границах полного нового согласования не требует. Pause/blocked/cancelled имеют явные причины и переходы; CLI проверяет конкретные ограничения.
6. Сохранять evidence с criterion, kind automated/manual, method, result pass/fail/not-run/not-applicable, fingerprint и artifacts. Приёмка привязана к текущему fingerprint; замечания/отказы проверок фиксируются явно.
7. После изменения входов разобрать diff и выполнить refresh. Он обновляет снимки, но не делает старые evidence новым PASS и не согласовывает Spec. Accepted при изменившихся входах возвращается в review; старый receipt остаётся историей.

## Решения владельца

Approve-spec, исключение и accepted опираются на реальное решение владельца. Note/CLI не удостоверяют личность. «Продолжай» не назначает приёмку. Пауза/отмена — по указанию владельца.

## Результат

Актуальный STATE, ссылки/хеши и существенные вехи внутри задачи. Прежние Markdown-ревизии сохраняются в history. Исторические JSON v1 внутри системы остаются историей; их schema/runtime удалены, legacy-команды данные не создают и не мигрируют.

## Проверка

Записи используют --expect, lock, fsync/атомарную замену и историю. При конфликте перечитать; чужой lock не удалять. Пути остаются внутри проекта без symlink/.. и приватных .env. Check/resume показывают stale; чтение не восстанавливает отсутствующие исторические файлы молча.

## Продолжение и возврат

Возобновление восстанавливает существующую задачу и следующий шаг. Изменённые входы требуют новых затронутых проверок. После проверенного завершения задачи среды временные материалы удаляются при согласованной очистке, запись BACKLOG закрывается/удаляется; продуктовые документы и история остаются в проекте.
