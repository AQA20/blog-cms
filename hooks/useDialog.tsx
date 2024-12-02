import { useState } from 'react';

export const useDialog = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: (...args: unknown[]) => unknown; // Accepts any function
    dismiss?: boolean;
  }>({
    open: false,
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone.',
    dismiss: true,
    onConfirm: () => null,
  });

  return [dialog, setDialog] as const;
};
