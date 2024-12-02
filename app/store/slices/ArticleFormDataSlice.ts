import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ArticleFormData } from '@/types/ArticleFormData';

interface InitialState {
  formData: ArticleFormData;
  error: string;
  success: boolean;
  isLoading: boolean;
}

// Initial state for the slice
const initialState: InitialState = {
  formData: {
    title: '',
    description: '',
    category: '',
    tags: [],
    thumbnail: undefined,
    content: '',
  },
  error: '',
  success: false,
  isLoading: false,
};

const articleFormData = createSlice({
  name: 'articleFromData',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<ArticleFormData>) => {
      state.formData = action.payload;
    },
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
export const { setFormData, setError, setSuccess, setIsLoading } =
  articleFormData.actions;
export default articleFormData.reducer;
