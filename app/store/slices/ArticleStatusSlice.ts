import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ArticleStatus } from '@/types/ArticleStatus';

interface ArticleStatusState {
  status: ArticleStatus;
}

// Initial state for the slice
const initialState: ArticleStatusState = {
  status: 'Approved',
};

// Create the slice
const articlesStatusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setArticleStatus: (state, action: PayloadAction<ArticleStatus>) => {
      state.status = action.payload;
    },
  },
});

// Export actions and reducer
export const { setArticleStatus } = articlesStatusSlice.actions;
export default articlesStatusSlice.reducer;
