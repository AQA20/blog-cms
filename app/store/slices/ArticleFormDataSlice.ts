import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  error: string;
  success: boolean;
  isLoading: boolean;
}

// Initial state for the slice
const initialState: InitialState = {
  error: '',
  success: false,
  isLoading: false,
};

const articleFormData = createSlice({
  name: 'articleFromData',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions and reducer
export const { setError, setSuccess, setIsLoading } = articleFormData.actions;
export default articleFormData.reducer;
