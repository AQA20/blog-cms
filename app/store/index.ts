import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/slices/userSlice';
import articlesReducer from '@/slices/ArticlesSlice';
import articleStatusReducer from '@/slices/ArticleStatusSlice';
import articleFormDataReducer from '@/slices/ArticleFormDataSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    user: userReducer,
    articles: articlesReducer,
    articleStatus: articleStatusReducer,
    articleForm: articleFormDataReducer,
  },
});

// While configureStore function automatically infers types, it's a good
// practice to explicitly define types for RootState and AppDispatch So
// typescript knows what state and dispatch types to expect
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create a custom hook for typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
