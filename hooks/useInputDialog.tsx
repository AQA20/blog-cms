import { useState } from 'react';
import { useDialog } from '@/hooks/useDialog';

interface InputDialogHandler {
  placeholder: string;
  title: string;
  description: string;
  dismiss?: boolean;
  handleConfirm: (value: string) => void;
}

interface DialogState {
  open: boolean;
  title: string;
  description: string;
  onConfirm: (...args: unknown[]) => unknown;
  dismiss?: boolean;
}

interface UseInputDialogReturn {
  input: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };
  setInput: React.Dispatch<
    React.SetStateAction<{
      placeholder: string;
      value: string;
      onChange: (value: string) => void;
    }>
  >;
  dialog: DialogState;
  setDialog: React.Dispatch<React.SetStateAction<DialogState>>;
  handler: (args: InputDialogHandler) => void;
}

export const useInputDialog = (): UseInputDialogReturn => {
  const [input, setInput] = useState<{
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  }>({
    placeholder: '',
    value: '',
    onChange: (value) => {},
  });
  const [dialog, setDialog] = useDialog();
  const handler = ({
    placeholder,
    title,
    description,
    dismiss = true,
    handleConfirm,
  }: InputDialogHandler) => {
    //Set input placeholder
    setInput((prev) => ({ ...prev, placeholder }));
    setDialog({
      open: true,
      title,
      description,
      dismiss,
      onConfirm: (value: string) => {
        handleConfirm(value);
      },
    });
    // Reset input value
    setInput((prev) => ({ ...prev, value: '' }));
  };

  return { input, setInput, dialog, setDialog, handler };
};
