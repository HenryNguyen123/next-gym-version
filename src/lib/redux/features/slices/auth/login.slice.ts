import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from '@/configs/axios.config'
// import type {UserData} from '@/lib/redux/features/slices/account/account.slice'
import { GenderEnum, FitnessGoalEnum, FitnessLevelEnum, PrivacySettingEnum } from '@/lib/enums/profile.enum'

interface LoginData {
    email: string,
    password:string,
    // remember: boolean,
}

// interface DataResponse{
//     EM: string
//     EC: number
//     DT: UserData | null
// }
interface DataResponse{
    accessToken: string
    refreshToken: string
    user: UserData | null
}
interface UserData{
  id: number;
  userName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  status: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  profile: ProfileDate,

  roles: UserRole[],
}

interface ProfileDate {
  id: number;
  fullName: string;
  avatar?: string;
  avatarPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  bio?: string;
  gender?: GenderEnum;
  birthday?: Date;
  phone?: string;
  height?: number;
  weight?: number;
  bodyFat?: number;
  goal?: FitnessGoalEnum;
  fitnessLevel: FitnessLevelEnum;
  experienceYears: number;
  city?: string;
  country?: string;
  privacySetting: PrivacySettingEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRole {
  name: string;
  code: string;
  description?: string;
  createdAt?: Date;
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