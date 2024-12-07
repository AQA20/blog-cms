import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import useLocalStorage from '@/hooks/useLocalStorage';
import { z, type ZodType } from 'zod';

export const useUnsavedChanges = <T extends ZodType<any, any, any>>(
  form: UseFormReturn<z.infer<T>>,
  edit: boolean,
) => {
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [_, setLocalStorageValue] = useLocalStorage('formData', {});

  const saveFormDataToLocalStorage = useCallback((data: z.infer<T>) => {
    const formData = data;
    // Use a regular expression to find and remove base64 images in the content
    formData.content = formData.content.replace(
      /<img[^>]+src="data:image\/[^;]+;base64[^"]+"[^>]*>/g,
      '',
    );
    delete formData.thumbnail;
    setLocalStorageValue(formData);
  }, []);

  // Watch for form changes
  useEffect(() => {
    if (edit) return;
    const subscription = form.watch((value) => {
      // Only set unsaved changes if there's actual user input
      const hasValues = Object.values(value).some((val) => {
        if (typeof val === 'string') {
          return val.trim().length > 0;
        } else if (Array.isArray(val)) {
          return val.length > 0;
        }  
        return val instanceof File;
        
      });
      saveFormDataToLocalStorage(value);
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
};

export default useUnsavedChanges;
