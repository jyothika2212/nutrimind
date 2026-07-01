import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDetails {
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  weight?: number;
  height?: number;
  bmi?: number;
  calorieGoal?: number;
  waterGoal?: number;
  assignedDietitian?: string;
  medicalConditions?: string[];
  allergies?: string[];
  dietaryPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Gluten-Free';
  weightGoal?: 'Lose' | 'Maintain' | 'Gain';
  targetWeight?: number;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Dietitian' | 'Nutritionist' | 'Admin';
  profilePicture?: string;
  isVerified?: boolean;
  userDetails?: UserDetails;
}

interface AuthState {
  user: UserState | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserState; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    updateUserProfile: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    initializeTheme: (state) => {
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});

export const { setLoading, loginSuccess, updateUserProfile, logout, toggleTheme, initializeTheme } = authSlice.actions;
export default authSlice.reducer;
