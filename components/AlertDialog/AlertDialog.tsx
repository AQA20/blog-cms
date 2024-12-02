import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  description: string;
  dismiss?: boolean;
  onConfirm: (...args: unknown[]) => unknown;
}

export const AppAlertDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  dismiss = true,
  onConfirm,
  children,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {children}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {dismiss && <AlertDialogCancel>Cancel</AlertDialogCancel>}
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
