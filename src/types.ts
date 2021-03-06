export enum ResponseMessage {
  ADD_COURSE_CONFIRMATION_SENT = 'ADD_COURSE_CONFIRMATION_SENT',
  ADD_COURSE_COURSE_ADDED = 'ADD_COURSE_COURSE_ADDED',
  ADD_COURSE_ERROR = 'ADD_COURSE_ERROR',
  USER_CONFIRMED = 'USER_CONFIRMED',
  WELCOME_MESSAGE = 'WELCOME_MESSAGE',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  SOMETHING_WENT_WRONG = 'SOMETHING_WENT_WRONG',
}

export interface NatsMessage {
  chatId: number;
  message: string;
}
