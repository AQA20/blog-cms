import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/User';

type UserState = {
  user: User | null;
};

// Initial state for the slice, trying to load the user from localStorage
const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      const user = action.payload;
      if (!user) return;
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

// Export actions and reducer
export const { login, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
