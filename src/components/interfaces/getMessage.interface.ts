export interface IWebhookMessage {
  body: {
    idMessage: string;
    instanceData: {
      idInstance: number;
      wid: string;
      typeInstance: string;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
    senderData: {
      chatId: string;
      chatName: string;
      sender: string;
      senderName: string;
      senderContactName: string;
    };
    timestamp: number;
    typeWebhook: string;
  };
  receiptId: number;
}
