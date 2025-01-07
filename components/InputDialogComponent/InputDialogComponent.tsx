'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { AppAlertDialog } from '@/components/AlertDialog/AlertDialog';
import { DialogState, InputType } from '@/hooks/useInputDialog';

interface Props<T = unknown> extends React.HtmlHTMLAttributes<HTMLDivElement> {
  dialog: DialogState;
  input: InputType;
  onDialogChange: () => void;
  onInputChange: (value: T) => void;
  className?: string;
}

export const InputDialogComponent = <T,>({
  dialog,
  input,
  onDialogChange,
  onInputChange,
  className,
}: Props<T>): React.ReactNode => {
  return (
    <AppAlertDialog
      className={className}
      title={dialog.title}
      description={dialog.description}
      onConfirm={dialog.onConfirm}
      open={dialog.open}
      dismiss={dialog.dismiss}
      onOpenChange={onDialogChange}
    >
      <Input
        type="text"
        placeholder={input.placeholder}
        value={input.value}
        onChange={(e) => onInputChange(e.target.value as T)}
      />
    </AppAlertDialog>
  );
};
