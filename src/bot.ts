import Sentry from './services/sentry';
import { ResponseMessage } from './types';
import ZendeskService from './services/zendesk';
import { addMessageToQueue } from './queue';
import { Message } from 'node-telegram-bot-api';

import { l } from './lang/ru';
import { getEmailFromString } from './helpers';
import {
  addCourseToUser,
  getConversation,
  addTicketIdToConversation,
} from './api';

import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_URL } from './constants';

const Bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
Bot.setWebHook(`${TELEGRAM_WEBHOOK_URL}/bot${TELEGRAM_BOT_TOKEN}`);

const getAnswer = async (
  text: string,
  chatId: number,
): Promise<ResponseMessage> =>
  new Promise(async (resolve, reject) => {
    if (text === '/start') return resolve(ResponseMessage.WELCOME_MESSAGE);

    const email = getEmailFromString(text);

    if (!email) return resolve(ResponseMessage.EMAIL_NOT_FOUND);

    try {
      const { messageType } = await addCourseToUser(
        email.toLowerCase(),
        chatId,
      );

      switch (messageType) {
        case 'confirmation_sent':
          return resolve(ResponseMessage.ADD_COURSE_CONFIRMATION_SENT);
        case 'course_added':
          return resolve(ResponseMessage.ADD_COURSE_COURSE_ADDED);
        case 'user_confirmed':
          return resolve(ResponseMessage.USER_CONFIRMED);
        default:
      }
    } catch (error) {
      Sentry.reportToSentry(
        new Error(
          `Cannot add course for user: ${email} from chatId: ${chatId}`,
        ),
      );
      reject(ResponseMessage.ADD_COURSE_ERROR);
    }
  });

export const handleBotMessage = ({ message }: { message: Message }) =>
  new Promise(async (resolve, reject) => {
    if (!message) return resolve();

    const {
      text,
      chat: { id: chatId },
    } = message;

    if (!text) return resolve();

    try {
      const { conversation } = await getConversation(chatId);
      const {
        zendesk_ticket_id: ticketId,
        user_email: email,
        user_full_name: userFullName,
      } = conversation;

      if (ticketId) {
        try {
          const { ticket } = await ZendeskService.findTicket(ticketId);
          await ZendeskService.addCommentToTicket(
            ticketId,
            ticket.requester_id,
            text,
          );
        } catch ({ response }) {
          if (response && response.status === 404) {
            createZendeskTicketAndAddToConversation(
              chatId,
              userFullName,
              email,
              text,
            )
              .then(resolve)
              .catch(reject);
          }
        }
      } else {
        createZendeskTicketAndAddToConversation(
          chatId,
          userFullName,
          email,
          text,
        )
          .then(resolve)
          .catch(reject);
      }
    } catch ({ response }) {
      if (response && response.status === 404) {
        const trimmedText = text.trim();

        getAnswer(trimmedText, chatId)
          .then(answer => {
            addMessageToQueue({
              chatId,
              message: l(answer),
            });
            resolve();
          })
          .catch(reject);
      } else {
        Sentry.reportToSentry(
          new Error(`Cannot get conversation for chatId: ${chatId}`),
        );
        reject();
      }
    }
  });

const createZendeskTicketAndAddToConversation = (
  chatId: number,
  userFullName: string,
  email: string,
  text: string,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const { ticket } = await ZendeskService.createTicket(
        chatId,
        userFullName,
        email,
        text,
      );
      try {
        await addTicketIdToConversation(chatId, ticket.id);
        resolve();
      } catch (error) {
        Sentry.reportToSentry(
          new Error(`Cannot add ticket to conversation: ${chatId}`),
        );
        reject(error);
      }
    } catch (error) {
      Sentry.reportToSentry(
        new Error(`Cannot create Zendesk ticket for chatId: ${chatId}`),
      );
      reject(error);
    }
  });

export default Bot;
