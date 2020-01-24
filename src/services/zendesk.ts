import axios from 'axios';
import Sentry from './sentry';
import {
  ZENDESK_API_AUTH,
  ZENDESK_API_URL,
  CHAT_ID_CUSTOM_FIELD_IDS,
  NEW_TICKET_TAGS,
} from '../constants';

const options = {
  headers: { Authorization: `Basic ${ZENDESK_API_AUTH}` },
};

class ZendeskService {
  static buildUrl(path: string) {
    return `${ZENDESK_API_URL}/${path}`;
  }

  getRequest(path: string) {
    const url = ZendeskService.buildUrl(path);

    return axios.get(url, options).then(response => response.data);
  }

  postRequest(path: string, data: {}) {
    const url = ZendeskService.buildUrl(path);

    return axios.post(url, data, options).then(response => response.data);
  }

  putRequest(path: string, data: {}) {
    const url = ZendeskService.buildUrl(path);

    return axios.put(url, data, options).then(response => response.data);
  }

  findTicket(ticketId: number) {
    return this.getRequest(`tickets/${ticketId}.json`);
  }

  createTicket(chatId: number, name = '', email = '', comment: string) {
    return this.postRequest('tickets.json', {
      ticket: {
        requester: { name, email },
        comment: { body: comment },
        tags: NEW_TICKET_TAGS,
        custom_fields: [
          {
            id: CHAT_ID_CUSTOM_FIELD_IDS[0],
            value: chatId,
          },
          {
            id: CHAT_ID_CUSTOM_FIELD_IDS[1],
            value: name,
          },
        ],
      },
    });
  }

  addCommentToTicket(ticketId: number, authorId: number, comment: string) {
    return this.putRequest(`tickets/${ticketId}.json`, {
      ticket: {
        status: 'open',
        comment: { body: comment, author_id: authorId },
      },
    });
  }
}

export default new ZendeskService();
