import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from '@/configs/axios.config'
import type {UserData} from '@/lib/redux/features/slices/account/account.slice'

interface LoginData {
    email: string,
    password:string,
    // remember: boolean,
}

interface DataResponse{
    EM: string
    EC: number
    DT: UserData | null
}

export interface DataState {
    data: DataResponse | null
    isLoading: boolean
    isError: boolean
}

export const loginAuthentication = createAsyncThunk<DataResponse, LoginData>(
  'auth/login',
  async (data) => {
    const response =  await axios.post<DataResponse>(process.env.NEXT_PUBLIC_LOGIN_USER_URL ?? '', {email: data.email, password: data.password})
    return response.data
  }
)

const initialState: DataState = {
  data: null,
  isLoading: false,
  isError: false
}

export const LoginAuthenSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
    .addCase(loginAuthentication.pending, (state) => {
        state.isLoading = true
        state.isError = false
    })
    .addCase(loginAuthentication.fulfilled, (state, action: PayloadAction<DataResponse>) => {
      console.log('payload login: ', action.payload)
        state.data = action.payload ? action.payload : null
        state.isLoading = false
        state.isError = false
    })
    .addCase(loginAuthentication.rejected, (state) => {
        state.isLoading = false
        state.isError = true
    })
  },
})

// Action creators are generated for each case reducer function

export default LoginAuthenSlice.reducer