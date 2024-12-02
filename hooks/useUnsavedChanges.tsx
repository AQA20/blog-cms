import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

export const useUnsavedChanges = <T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  edit: boolean,
) => {
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Watch for form changes
  useEffect(() => {
    if (edit) return;
    const subscription = form.watch((value) => {
      // Only set unsaved changes if there's actual user input
      const hasValues = Object.values(value).some((val) => {
        if (typeof val === 'string') {
          return val.trim().length > 0;
        }
        return val !== undefined;
      });

      setHasUnsavedChanges(hasValues);
    });

    return () => subscription.unsubscribe();
  }, [edit, form, setHasUnsavedChanges]);

  // Handle browser refresh/close
  useEffect(() => {
    if (edit) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [edit, hasUnsavedChanges]);

  // Handle link clicks
  useEffect(() => {
    if (edit) return;
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link) return;

      // Ignore links without href or javascript: links or anchor links
      const href = link.getAttribute('href');
      if (!href || href.startsWith('javascript:') || href.startsWith('#'))
        return;

      if (hasUnsavedChanges) {
        e.preventDefault();

        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?',
        );
        if (confirmLeave) {
          setHasUnsavedChanges(false); // Reset unsaved changes
          window.location.href = href; // Direct navigation instead of router.push
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [edit, hasUnsavedChanges, router]);

  // Handle browser back button
  useEffect(() => {
    // Add popstate event listener for browser back button
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirm = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?',
        );

        if (!confirm) {
          // Push a new entry to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Push initial state to enable popstate handling
    window.history.pushState(null, '', window.location.href);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);
};

export default useUnsavedChanges;
