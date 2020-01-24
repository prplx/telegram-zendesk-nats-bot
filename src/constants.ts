import { env } from './helpers';

export const TELEGRAM_NATS_SUBJECT = 'telegram-messages';
export const TELEGRAM_NATS_UNSENT_SUBJECT = 'telegram-unsent-messages';
export const TELEGRAM_BOT_TOKEN = env('TELEGRAM_BOT_TOKEN');
export const TELEGRAM_BOT_API_TOKEN = env('TELEGRAM_BOT_API_TOKEN');
export const TELEGRAM_WEBHOOK_URL = env('TELEGRAM_WEBHOOK_URL');
export const ZENDESK_API_AUTH = Buffer.from(
  `${env('ZENDESK_USER')}/token:${env('ZENDESK_TOKEN')}`,
).toString('base64');
export const ZENDESK_TOKEN = env('ZENDESK_TOKEN');
export const ZENDESK_USER = env('ZENDESK_USER');
export const ZENDESK_API_URL = env('ZENDESK_API_URL');
export const CHAT_ID_CUSTOM_FIELD_IDS = env('CHAT_ID_CUSTOM_FIELD_IDS');
export const NEW_TICKET_TAGS = ['telegram_bot'];
export const HOST = env('HOST');
export const SENTRY_DSN = env('SENTRY_DSN');
export const NATS_HOST = env('NATS_HOST');
export const NATS_CLUSTER = env('NATS_CLUSTER');
