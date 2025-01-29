import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ILoginState } from "../../components/forms/loginForms/LoginForms";
import { axiosApiClient } from "../../helpers/axiosApiClient";
import { IWebhookMessage } from "../../interfaces/getMessage.interface";
import { IPostMessage } from "../../interfaces/postMessage.interface";

export interface IMessage {
  text: string;
  date: string;
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

interface IGetMessages {
  token: string;
  user: string;
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
      localStorage.removeItem("phoneNumbers");
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
          const newMessage: IMessage = {text: message, date: new Date().toISOString(), user: true}
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
              const date = new Date(message.body.timestamp * 1000).toISOString()
              const finIndex = state.phoneNumbers.findIndex(
                (item) => item.phone == parseInt(senderPhoneNumber)
              );

              if (finIndex !== -1) {
                const newMessage: IMessage = {
                  text:
                    message.body.messageData.textMessageData?.textMessage || "",
                  date: date,
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
