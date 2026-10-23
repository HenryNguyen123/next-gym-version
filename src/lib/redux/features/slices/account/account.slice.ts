import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';

export interface UserData {
  data: {
    age: number;
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
    userName: string;
    roleId: number;
    roleCode: string;
    loginBy: string;
  };
}
export interface dataLogin {
  rememberUser: boolean,
  data: UserData | null
}

interface UserState {
    data: UserData | null ,
    isLogin: boolean,
    isLoading: boolean
}

const initialState: UserState = {
  data: null,
  isLogin: false,
  isLoading: true
}

const AccountSlice = createSlice({
  name: 'account/account',
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<dataLogin>) {
      if (!action.payload || !action.payload.data) return
      state.isLogin = true
      state.data = action.payload.data
      state.isLoading = false
      if(state.isLogin && action.payload) {
          const dataLogin = {data: (action.payload?.data?.data ? action.payload?.data?.data: action.payload?.data)}
          Cookies.set('USER', JSON.stringify(dataLogin), action.payload.rememberUser ? { expires: 7 } : undefined)
      } 
    },
    getLogin(state) {
      try {
        const cookie = Cookies.get('USER');

        if (cookie) {
          const getcookie =  JSON.parse(cookie)
          const dataCookie: UserData = {
            data: getcookie.data
          } 
          state.data = dataCookie;
          state.isLogin = true;
          state.isLoading = false;
          return;
        }
        state.data = null;
        state.isLogin = false;
        state.isLoading = false;
      } catch (error) {
        console.error("Error parsing login data:", error);
        state.data = null;
        state.isLogin = false;
        state.isLoading = false;

        Cookies.remove('USER');
      }
    },
    logoutUser(state) {
      try {
        Cookies.remove('USER')
        Cookies.remove('USER')
        state.isLogin = false
        state.isLoading = false
        state.data =null
        console.log('logout success!')
      } catch (error) {
        console.log(error)
      }
    }
  },
})

export const { setLogin, getLogin, logoutUser } = AccountSlice.actions
export default AccountSlice.reducer

