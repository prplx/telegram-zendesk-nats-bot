import { ResponseMessage } from '../types';

const MESSAGES: { [key in ResponseMessage]: string } = {
  ADD_COURSE_CONFIRMATION_SENT:
    'Для получения подарка тебе нужно подтвердить свой email. Перейди в почту, найди письмо от GeekBrains и активируй аккаунт.',
  ADD_COURSE_COURSE_ADDED:
    'Спасибо! Я открыл тебе курс "Как стать программистом", ты можешь увидеть его в разделе [Обучение](https://geekbrains.ru/education). По любым вопросам можешь писать мне в чат, я всегда на связи!',
  ADD_COURSE_ERROR: 'Произошла ошибка. Попробуй еще раз.',
  USER_CONFIRMED:
    'Спасибо! Я открыл тебе курс "Как стать программистом", ты можешь увидеть его в разделе [Обучение](https://geekbrains.ru/education). По любым вопросам можешь писать мне в чат, я всегда на связи!',
  WELCOME_MESSAGE:
    'Привет! Я бот-помощник GeekBrains. У меня есть для тебя подарок. Для получения, напиши свой email',
  EMAIL_NOT_FOUND: 'Email не найден',
  SOMETHING_WENT_WRONG: 'Что-то пошло не так',
};

export const l = (slug: ResponseMessage) => MESSAGES[slug];
