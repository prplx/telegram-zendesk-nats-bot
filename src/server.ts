import express from 'express';
import bodyParser from 'body-parser';
import { addMessageToQueue } from './queue';
import { handleBotMessage } from './bot';
import { TELEGRAM_BOT_TOKEN, ZENDESK_TOKEN } from './constants';

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post(`/zendesk${ZENDESK_TOKEN}`, (req, res) => {
  const { comment, chatId } = req.body;

  addMessageToQueue({
    chatId,
    message: comment,
  });

  res.sendStatus(200);
});

app.post(`/bot${TELEGRAM_BOT_TOKEN}`, (req, res) => {
  handleBotMessage(req.body)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

app.listen(port);
