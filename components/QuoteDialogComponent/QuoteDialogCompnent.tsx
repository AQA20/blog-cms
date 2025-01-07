'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppAlertDialog } from '@/components/AlertDialog/AlertDialog';
import { FormLabel } from '@/components/ui/form';

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: (...args: any) => void;
  className?: string;
}

export const QuoteDialogComponent: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  className,
}): React.ReactNode => {
  const [quote, setQuote] = useState('');
  const [quoteBy, setQuoteBy] = useState('');

  const onDialogConfirm = () => {
    onConfirm(quote, quoteBy);
    setQuote('');
    setQuoteBy('');
  };

  return (
    <AppAlertDialog
      className={className}
      title="Add a quote to your article."
      description="Quote and attribute the speaker."
      onConfirm={onDialogConfirm}
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <FormLabel className="my-2">Quote text</FormLabel>
      <Textarea
        placeholder="Enter quote content"
        className="h-[220px] resize-none overflow-hidden md:h-[80px]"
        maxLength={200}
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
      />
      <FormLabel className="my-2">QuoteBy</FormLabel>
      <Input
        type="text"
        placeholder="The person who said it"
        value={quoteBy}
        onChange={(e) => setQuoteBy(e.target.value)}
      />
    </AppAlertDialog>
  );
};
