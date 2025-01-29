export interface IPostMessage {
  post: {
    chatId: string;
    message: string;
  };
  token: string;
  user: string;
}
