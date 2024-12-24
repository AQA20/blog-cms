'use client';

import React, { useRef, useState, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Underline,
  Link,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Youtube,
  Twitter,
  Facebook,
  Instagram,
  Quote,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useTipTapEditorSetters } from '@/hooks/useTipTapEditorSetters';
import { useInputDialog } from '@/hooks/useInputDialog';
import { InputDialogComponent } from '@/components/InputDialogComponent/InputDialogComponent';
import { QuoteDialogComponent } from '../QuoteDialogComponent/QuoteDialogCompnent';
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/services/articlesService';

type Props = {
  editor: Editor | null;
};

const toggleStyle = 'rounded-full';

export const Toolbar = ({ editor }: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [openQuoteDialog, setOpenQuoteDialog] = useState(false);
  const {
    setImage,
    setLoadingImage,
    setLink,
    setYoutubeVideo,
    setTweet,
    setFbPost,
    setInstaPost,
    setQuote,
  } = useTipTapEditorSetters(editor);
  const { input, setInput, dialog, setDialog, handler } = useInputDialog();

  const { mutateAsync, isPending } = useMutation<
    { url: string; name: string } | undefined,
    Error,
    File | undefined
  >({
    mutationFn: async (file: File | undefined) => {
      if (!file) return;
      const response = await uploadImage(file);
      return response;
    },
    onSuccess: (data: { url: string; name: string } | undefined) => {
      if (!data) return;
      setImage(data.url, input.value, data.name);
    },
    onError: (error) => {
      console.error('Error logging in:', error.message);
    },
  });

  useEffect(() => {
    if (isPending) {
      setLoadingImage();
    }
  }, [isPending]);

  const openLinkPicker = () => {
    handler({
      placeholder: 'Add a valid URL',
      title: 'Add a Link',
      description: 'Provide a valid URL',
      handleConfirm: setLink,
    });
  };

  const openImagePicker = () => {
    handler({
      placeholder: 'Image alt attribute',
      title: 'Add Alt Text to Your Image',
      description:
        'Provide a brief description of your image to improve accessibility and SEO.',
      handleConfirm: () => imageInputRef.current?.click(),
    });
  };

  const openYoutubePicker = () => {
    handler({
      placeholder: 'YouTube video source link',
      title: 'Add YouTube Video',
      description: 'Enter a valid YouTube video URL',
      handleConfirm: setYoutubeVideo,
    });
  };

  const openTwitterPicker = () => {
    handler({
      placeholder: 'Add any tweet id',
      title: 'Add any tweet to your article',
      description: 'Enter a valid tweet id',
      handleConfirm: setTweet,
    });
  };

  const openFbPicker = () => {
    handler({
      placeholder: 'Add a facebook post url',
      title: 'Add any facebook post url to your article',
      description: 'Enter a valid facebook url',
      handleConfirm: setFbPost,
    });
  };

  const openInstaPicker = () => {
    handler({
      placeholder: 'Add an instagram post url',
      title: 'Add any instagram post url to your article',
      description: 'Enter a valid instagram url',
      handleConfirm: setInstaPost,
    });
  };

  const handleInputChange = (value: string) => {
    setInput((prev) => ({
      ...prev,
      value: value, // Update the input's value dynamically
    }));
    // Updates the onConfirm function with the new input's value I had to do
    // this because of the asynchronous behavior of state update as it doesn't
    // updates the value immediately so in order to get the latest input value I
    // have to reset the onConfirm callback providing it with latest value
    setDialog({
      ...dialog,
      onConfirm: () => dialog.onConfirm(value),
    });
  };

  const handleQuoteDialogConfirm = (quote: string, quoteBy: string) => {
    setQuote(quote, quoteBy);
    setOpenQuoteDialog(false);
  };

  if (!editor) return null;
  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={(e) => mutateAsync(e.target.files?.[0])}
      />
      <InputDialogComponent
        input={input}
        dialog={dialog}
        onDialogChange={() => setDialog({ ...dialog, open: !dialog.open })}
        onInputChange={handleInputChange}
      />

      <QuoteDialogComponent
        isOpen={openQuoteDialog}
        onConfirm={handleQuoteDialogConfirm}
        onOpenChange={() => setOpenQuoteDialog(!openQuoteDialog)}
      />

      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('image')}
        onPressedChange={openImagePicker}
      >
        <ImageIcon className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('youtube')}
        onPressedChange={openYoutubePicker}
      >
        <Youtube className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('twitter')}
        onPressedChange={openTwitterPicker}
      >
        <Twitter className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('facebook')}
        onPressedChange={openFbPicker}
      >
        <Facebook className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('instagram')}
        onPressedChange={openInstaPicker}
      >
        <Instagram className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('quote')}
        onPressedChange={() => setOpenQuoteDialog(true)}
      >
        <Quote className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('link')}
        onPressedChange={openLinkPicker}
      >
        <Link className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('link')}
        onPressedChange={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        <Unlink className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('undo')}
        onPressedChange={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-6 w-6" />
      </Toggle>
      <Toggle
        size="lg"
        className={toggleStyle}
        pressed={editor.isActive('redo')}
        onPressedChange={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-6 w-6" />
      </Toggle>
    </div>
  );
};
