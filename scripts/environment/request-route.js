export function routeRequest(request) {
  if (typeof request !== 'string' || !request.trim()) throw Error('Request is required');
  const text = request.toLowerCase();
  if (/не (делаем|нужно|надо)|отмен[аи]|cancel/.test(text))
    return { intent: 'cancel', requiresExistingTask: true, implement: false };
  if (/пауз|приостанов|остановись/.test(text))
    return { intent: 'pause', requiresExistingTask: true, implement: false };
  if (/^(продолж|давай дальше|resume)/.test(text.trim()))
    return { intent: 'resume', requiresExistingTask: true, implement: false };
  if (/^(принято|согласован|accepted)/.test(text.trim()))
    return { intent: 'accept', requiresExistingTask: true, implement: false };
  const action = /аудит|свер|audit/.test(text)
    ? 'audit'
    : /исслед|изуч|research/.test(text)
      ? 'research'
      : /документ|documentation/.test(text)
        ? 'document'
        : /релиз|выпуск|release/.test(text)
          ? 'release'
          : /исправ|почин|сломал|баг|bug|repair|fix/.test(text)
            ? 'repair'
            : /доработ|измен|добав.*вариант|refine/.test(text)
              ? 'refine'
              : /провер/.test(text)
                ? 'audit'
                : 'create';
  if (/иконк|(?:^|[^а-яё])график|chart/.test(text))
    return {
      intent: 'scope-check',
      deferredScope: true,
      implement: false,
      question: 'Icon/chart development is excluded until a new explicit scope decision.',
    };
  const explicitNewSystem =
    action === 'create' &&
    /(?:созда[а-яё]*|разработ[а-яё]*)\s+(?:нов[а-яё]*\s+)?дизайн[ -]?систем|(?:create|build)\s+(?:a\s+)?(?:new\s+)?design system|^(?:новая\s+дизайн[ -]?систем|new design system)/.test(
      text,
    );
  const object = explicitNewSystem
    ? 'system'
    : /компонент|кнопк|инпут|input|button|select|label|поле/.test(text)
      ? 'component'
      : /примитив|primitive|типограф|шрифт|font|токен|(?:^|\s)тем[аыуе](?=\s|$)|token|(?:^|\s)theme/.test(
            text,
          )
        ? 'tokens'
        : /дизайн[ -]?систем|design system/.test(text)
          ? 'system'
          : /сред[ауы]|environment/.test(text)
            ? 'environment'
            : action === 'document'
              ? 'documentation'
              : null;
  return {
    intent: 'work',
    action,
    object,
    implement: false,
    intake: ['directives/intake.md', 'directives/briefing.md'],
    nextStep: object
      ? 'Read directive, select system, restore/create journal and complete sufficient briefing.'
      : 'Clarify the requested object and result before implementation.',
    limitations: [
      'Keyword routing suggests a route; the agent must check context and resolve ambiguity. This does not execute briefing or authorize writes.',
    ],
  };
}
