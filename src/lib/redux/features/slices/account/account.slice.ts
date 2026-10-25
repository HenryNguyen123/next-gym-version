import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { UserData } from "@/lib/types/account";
import {
  clearAccount,
  readAccount,
  saveAccount,
} from "@/lib/auth/account-storage";

export type { UserData } from "@/lib/types/account";

export interface DataLogin {
  rememberUser: boolean;
  data: UserData | null;
}

interface UserState {
  data: UserData | null;
  isLogin: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  data: null,
  isLogin: false,
  isLoading: true,
};

/**
 * Lưu account vào sessionStorage sau khi API login thành công.
 * rememberUser được giữ tạm để tương thích với form hiện tại.
 * Account vẫn dùng sessionStorage, không lưu lâu dài theo flag này.
 */
export const setLogin = createAsyncThunk<
  UserData | null,
  DataLogin
>("account/setLogin", async ({ data }) => {
  if (!data) return null;

  saveAccount(data);

  return data;
});

/**
 * Khôi phục account khi ứng dụng được mở hoặc reload.
 */
export const getLogin = createAsyncThunk<UserData | null>(
  "account/getLogin",
  async () => readAccount(),
);

/**
 * Xóa account phía client.
 * Cookie HttpOnly phải được xóa qua API logout của NestJS.
 */
export const logoutUser = createAsyncThunk<void>(
  "account/logoutUser",
  async () => {
    clearAccount();
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setLogin.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLogin = action.payload !== null;
        state.isLoading = false;
      })
      .addCase(setLogin.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLogin.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLogin = action.payload !== null;
        state.isLoading = false;
      })
      .addCase(getLogin.rejected, (state) => {
        state.data = null;
        state.isLogin = false;
        state.isLoading = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isLogin = false;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.data = null;
        state.isLogin = false;
        state.isLoading = false;
      });
  },
});

export default accountSlice.reducer;