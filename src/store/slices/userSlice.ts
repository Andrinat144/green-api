import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ILoginState } from "../../components/forms/loginForms/LoginForms";
import { axiosApiClient } from "../../helpers/axiosApiClient";

export interface IMessage {
  text: string;
  date: Date;
  user: boolean;
}

export interface IPhone {
  phone: number;
  messages: IMessage[];
}

interface UserState {
  user: ILoginState | null;
  error: Error | null;
  loading: boolean;
  phoneNumbers: IPhone[];
}

export interface IPostMessage {
  post: {
    chatId: string;
    message: string;
  };
  token: string;
  user: string;
}

interface IGetMessages {
  token: string;
  user: string;
}

interface IWebhookMessage {
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

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  error: null,
  loading: false,
  phoneNumbers: JSON.parse(localStorage.getItem("phoneNumbers") || "[]"),
};

export const postNewMessage = createAsyncThunk(
  "user/postNewMessage",
  async (body: IPostMessage) => {
    const response = await axiosApiClient.post<{ idMessage: string }>(
      `/waInstance${body.user}/sendMessage/${body.token}`,
      body.post
    );
    return response.data;
  }
);

export const getMessages = createAsyncThunk(
  "user/getMessages",
  async ({ token, user }: IGetMessages) => {
    const messages: IWebhookMessage[] = [];

    while (true) {
      const response = await axiosApiClient.get<IWebhookMessage | null>(
        `/waInstance${user}/receiveNotification/${token}?receiveTimeout=5`
      );

      console.log(response.data);

      if (!response.data) {
        break;
      }

      messages.push(response.data);

      await axiosApiClient.delete(
        `/waInstance${user}/deleteNotification/${token}/${response.data.receiptId}`
      );
    }

    return messages;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    saveUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    saveNumber: (state, action) => {
      state.phoneNumbers = [...state.phoneNumbers, action.payload];
      localStorage.setItem("phoneNumbers", JSON.stringify(state.phoneNumbers));
    },
    saveMessages: (state, action) => {
      const { id, message } = action.payload;

      state.phoneNumbers = state.phoneNumbers.map((phone, index) => {
        if (index === id) {
          const newMessage: IMessage = {text: message, date: new Date(), user: true}
          return {
            ...phone,
            messages: Array.isArray(phone.messages)
              ? [...phone.messages, newMessage]
              : [newMessage],
          };
        }
        return phone;
      });
      localStorage.setItem("phoneNumbers", JSON.stringify(state.phoneNumbers));
    },
  },
  extraReducers: (build) => {
    build
      .addCase(postNewMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postNewMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
      })
      .addCase(postNewMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && Array.isArray(action.payload)) {
          action.payload.forEach((message) => {
            if (message.body.senderData && message.body.senderData.chatId) {
              const senderPhoneNumber =
                message.body.senderData.chatId.split("@")[0];
              const finIndex = state.phoneNumbers.findIndex(
                (item) => item.phone == parseInt(senderPhoneNumber)
              );

              if (finIndex !== -1) {
                const newMessage: IMessage = {
                  text:
                    message.body.messageData.textMessageData?.textMessage || "",
                  date: new Date(message.body.timestamp),
                  user: false,
                };
                state.phoneNumbers[finIndex].messages = Array.isArray(
                  state.phoneNumbers[finIndex].messages
                )
                  ? [...state.phoneNumbers[finIndex].messages, newMessage]
                  : [newMessage];
              }
            }
          });
        }
        localStorage.setItem(
          "phoneNumbers",
          JSON.stringify(state.phoneNumbers)
        );
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { logout, saveUser, saveNumber, saveMessages } = userSlice.actions;
export default userSlice.reducer;
