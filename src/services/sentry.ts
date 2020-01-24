import * as Sentry from '@sentry/node';
import { SENTRY_DSN } from '../constants';

Sentry.init({
  dsn: SENTRY_DSN,
  environment:
    process.env.NODE_ENV === 'development' ? 'development' : 'production',
});

export const reportToSentry = (
  error: Error,
  message?: string,
  level: Sentry.Severity = Sentry.Severity.Error,
  context: {
    tags?: { [key: string]: string };
    extra?: { [key: string]: string };
  } = {},
) => {
  let kontext = context;
  if (message) kontext.extra = { ...kontext.extra, message };

  Sentry.withScope(scope => {
    if (kontext.tags) scope.setTags(kontext.tags);
    if (kontext.extra) scope.setExtras(kontext.extra);

    scope.setLevel(level);
    Sentry.captureException(error);
  });
};

export default { reportToSentry };
