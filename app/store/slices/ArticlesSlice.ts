import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { PaginatedArticles } from '@/types/PaginatedArticles';
import { FIRST_PAGE } from '@/lib/constants';

// Initial state for the slice
const initialState: PaginatedArticles = {
  articles: [],
  totalPages: 1,
  page: FIRST_PAGE,
  hasNextPage: false,
  error: '',
  loading: false,
  order: 'DESC',
};

// Create the slice
const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<PaginatedArticles>) => {
      state.articles = action.payload.articles;
      state.hasNextPage = action.payload.hasNextPage;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setOrder: (state, action: PayloadAction<'DESC' | 'ASC'>) => {
      state.order = action.payload;
    },
  },
});

// Export actions and reducer
export const { setArticles, setPage, setLoading, setError, setOrder } =
  articlesSlice.actions;
export default articlesSlice.reducer;
