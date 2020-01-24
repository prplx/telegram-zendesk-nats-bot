import axios from 'axios';
import { HOST, TELEGRAM_BOT_API_TOKEN } from './constants';

const options = {
  headers: { 'X-Bot-Auth': TELEGRAM_BOT_API_TOKEN },
};

export const getConversation = (chatId: number) =>
  axios
    .get(`${HOST}/api/v2/telegram_bot/conversation?chatId=${chatId}`, options)
    .then(response => response.data);

export const addCourseToUser = (email: string, chatId: number) =>
  axios
    .post(`${HOST}/api/v2/telegram_bot/add_course`, { email, chatId }, options)
    .then(response => response.data);

export const addTicketIdToConversation = (chatId: number, ticketId: number) =>
  axios
    .put(
      `${HOST}/api/v2/telegram_bot/conversation`,
      { chatId, zendeskTicketId: ticketId },
      options,
    )
    .then(response => response.data);
