import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type properly
interface FormSubmitContextType {
  submitFn: () => Promise<void>;
  setSubmitFn: React.Dispatch<React.SetStateAction<() => Promise<void>>>;
}

const FormSubmitContext = createContext<FormSubmitContextType | undefined>(
  undefined,
);

export const FormSubmitProvider = ({ children }: { children: ReactNode }) => {
  const defaultSubmitFn = async () => {};
  const [submitFn, setSubmitFn] =
    useState<() => Promise<void>>(defaultSubmitFn);

  return (
    <FormSubmitContext.Provider value={{ submitFn, setSubmitFn }}>
      {children}
    </FormSubmitContext.Provider>
  );
};

export const useFormSubmit = (): FormSubmitContextType => {
  const context = useContext(FormSubmitContext);
  if (!context) {
    throw new Error('useFormSubmit must be used within a FormSubmitProvider');
  }
  return context;
};
