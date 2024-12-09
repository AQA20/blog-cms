'use client';

import React, { useRef } from 'react';
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
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { AppAlertDialog } from '@/components/AlertDialog/AlertDialog';
import { Input } from '@/components/ui/input';
import { useTipTapEditorSetters } from '@/hooks/useTipTapEditorSetters';
import { useInputDialog } from '@/hooks/useInputDialog';

type Props = {
  editor: Editor | null;
};

const toggleStyle = 'rounded-full';

export const Toolbar = ({ editor }: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { setImage, setLink, setYoutubeVideo, setTweet } =
    useTipTapEditorSetters(editor);
  const { input, setInput, dialog, setDialog, handler } = useInputDialog();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput((prev) => ({
      ...prev,
      value: newValue, // Update the input's value dynamically
    }));
    // Update dialog onConfirm function with the nextValue
    setDialog({
      ...dialog,
      onConfirm: () => dialog.onConfirm(newValue),
    });
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
        onChange={(e) => setImage(e, input.value)}
      />

      <AppAlertDialog
        title={dialog.title}
        description={dialog.description}
        onConfirm={dialog.onConfirm}
        open={dialog.open}
        dismiss={dialog.dismiss}
        onOpenChange={() => setDialog({ ...dialog, open: !dialog.open })}
      >
        <Input
          type="text"
          placeholder={input.placeholder}
          value={input.value}
          onChange={handleInputChange}
        />
      </AppAlertDialog>
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
