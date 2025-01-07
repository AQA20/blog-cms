import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { ReactNode } from 'react';
import { ToastVariant } from '@/types/ToastVariant';
import { DEFAULT_TITLES, DEFAULT_VARIANTS } from '@/lib/constants';

// Define the parameters for the showToast function
type ToastParams = {
  description: string;
  success?: boolean; // Determines if the toast is a success or error
  title?: string; // Optional custom title
  variant?: ToastVariant; // Optional custom variant
  action?: ReactNode; // Custom action (must be wrapped in ToastAction)
};

export const useAppToast = () => {
  const { toast } = useToast();

  const showToast = ({
    description,
    success = true,
    title,
    variant,
    action,
  }: ToastParams) => {
    toast({
      variant:
        variant ??
        (success ? DEFAULT_VARIANTS.success : DEFAULT_VARIANTS.error),
      title: title ?? (success ? DEFAULT_TITLES.success : DEFAULT_TITLES.error),
      description,
      action: action ? (
        <ToastAction altText="Action">{action}</ToastAction>
      ) : (
        <ToastAction altText="Dismiss">Dismiss</ToastAction>
      ),
    });
  };

  return { showToast };
};
