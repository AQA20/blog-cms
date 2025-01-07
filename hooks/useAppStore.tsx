import { RootState, useAppDispatch } from '@/app/store';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';

// Define a typed version of useSelector
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppStore = () => {
  const dispatch = useAppDispatch();

  const useSelect = <T,>(selector: (state: RootState) => T): T => {
    return useAppSelector(selector);
  };

  return { useSelect, dispatch };
};
