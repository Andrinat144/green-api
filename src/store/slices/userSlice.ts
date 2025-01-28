import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ILoginState } from "../../components/forms/loginForms/LoginForms";
import { axiosApiClient } from "../../helpers/axiosApiClient";

export interface IPhone {
  phone: number;
  messages: string[];
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

const initialState: UserState = {
  user: null,
  error: null,
  loading: false,
  phoneNumbers: [],
};

export const postNewMessage = createAsyncThunk(
  "user/postNewMessage",
  async (body: IPostMessage) => {
    const response =  await axiosApiClient.post<{ idMessage: string }>(
      `/waInstance${body.user}/sendMessage/${body.token}`,
      body.post
    );
    return response.data
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    saveUser: (state, action) => {
      state.user = action.payload;
    },
    saveNumber: (state, action) => {
      state.phoneNumbers = [...state.phoneNumbers, action.payload];
    },
    saveMessages: (state, action) => {
      const { id, message } = action.payload;

      state.phoneNumbers = state.phoneNumbers.map((phone, index) => {
        if (index === id) {
          return {
            ...phone,
            messages: Array.isArray(phone.messages)
              ? [...phone.messages, message]
              : [message],
          };
        }
        return phone;
      });
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
      });
  },
});

export const { logout, saveUser, saveNumber, saveMessages } = userSlice.actions;
export default userSlice.reducer;
