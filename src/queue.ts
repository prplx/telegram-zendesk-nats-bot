import { connect, Stan, Message } from 'node-nats-streaming';
import { Semaphore } from 'await-semaphore';
import { l } from './lang/ru';
import Sentry from './services/sentry';
import Bot from './bot';
import {
  TELEGRAM_NATS_SUBJECT,
  TELEGRAM_NATS_UNSENT_SUBJECT,
  NATS_HOST,
  NATS_CLUSTER,
} from './constants';
import { ResponseMessage, NatsMessage } from './types';

const semaphore = new Semaphore(50);
let stan: Stan;

try {
  stan = connect(NATS_CLUSTER, 'telegram-queue-node-service', {
    url: `nats://${NATS_HOST}:4222`,
  });

  stan.on('connect', () => {
    const opts = stan.subscriptionOptions();
    opts.setDurableName('telegram-durable');
    opts.setManualAckMode(true);
    opts.setAckWait(60 * 1000);

    const sub = stan.subscribe(TELEGRAM_NATS_SUBJECT, opts);

    sub.on('message', (msg: Message) => {
      const data = msg.getData();

      if (typeof data !== 'string') return;

      semaphore.acquire().then(release => {
        const parsedContent = JSON.parse(data);
        const { chatId, messageType } = parsedContent;
        let { message } = parsedContent;

        switch (messageType) {
          case 'mailing':
            break;
          case 'user_confirmed':
            message = l(ResponseMessage.USER_CONFIRMED);
        }

        Bot.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
        })
          .then(
            () => {
              msg.ack();
              release();
            },
            error => {
              Sentry.reportToSentry(error, 'Cannot send message to Telegram');

              if (error.code === 'ETELEGRAM') {
                addMessageToQueue(
                  { chatId, message },
                  TELEGRAM_NATS_UNSENT_SUBJECT,
                );
                msg.ack();
              }
              release();
            },
          )
          .catch(error => {
            Sentry.reportToSentry(error, 'Cannot send message to Telegram');
            msg.ack();
            release();
          });
      });
    });

    process.once('SIGINT', () => {
      sub.unsubscribe();
      sub.on('unsubscribed', () => stan.close());
    });
  });
} catch (error) {
  Sentry.reportToSentry(error, 'Cannot connect to the NATS server');
}

const createQueueMessage = (message: NatsMessage, campaignId = 0) => {
  const item = {
    ...message,
    campaignId,
    createdAt: new Date().toISOString(),
  };

  return Buffer.from(JSON.stringify(item));
};

export const addMessageToQueue = (
  data: NatsMessage,
  subject = TELEGRAM_NATS_SUBJECT,
) => {
  const message = createQueueMessage(data);
  stan.publish(subject, message, error => {
    if (error) {
      Sentry.reportToSentry(error, 'Cannot connect to the NATS server');
    }
  });
};
