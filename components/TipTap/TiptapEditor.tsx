'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { Toolbar } from '@/components/TipTap/Toolbar';
import { useAppEditorConfig } from '@/hooks/useAppEditorConfig';
import './styles/editor.css';
import {
  extractImgUrlFromHtml,
  extractFilenameFromCloudFrontUrl,
} from '@/lib/utils';
import { deleteImage } from '@/services/articlesService';
interface TiptapEditorProps {
  content: string;
  className: string;
  onChange: (richText: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  className,
  content,
  onChange,
}) => {
  const [characterCount, setCharacterCount] = useState(0); // State to track the number of characters.
  const [wordCount, setWordCount] = useState(0); // State to track the number of words.
  const { editorConfig } = useAppEditorConfig(); // Get editor configuration using a custom hook.
  const currentImages = useRef<string[]>([]); // Ref to store current image URLs.
  const deletedImages = useRef<string[]>([]); // Ref to store deleted image URLs.

  const editor: Editor | null = useEditor({
    // Initialize the editor with configuration.
    ...editorConfig, // Spread in custom editor configuration.
    content, // Set initial content.
    editorProps: {
      attributes: {
        // Define CSS classes for the editor.
        class:
          'rounded-md border border-input focus:border-input border-border px-3 py-8 min-h-[200px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      },
      handlePaste: (view, event) => {
        // Handle paste events in the editor.
        const pastedText = event.clipboardData // Get pasted text from clipboard.
          ?.getData('text')
          ?.replace(/\n\s*\n*/g, '\n') // Remove extra newlines.
          .trim(); // Trim whitespace.
        if (pastedText) {
          editor?.commands.insertContent(pastedText); // Insert pasted text into the editor.
        }
        return true; // Indicate that the paste event was handled.
      },
    },
    onUpdate({ editor }) {
      // Handle updates to the editor content.
      const html = editor.getHTML(); // Get the current HTML content.
      onChange(html); // Call the onChange callback with the new content.
      const { characters, words } = editor.storage.characterCount; // Get character and word counts.
      setCharacterCount(characters); // Update character count state.
      setWordCount(words); // Update word count state.
      const currentImageUrls = extractImgUrlFromHtml(html);

      // I'm using spreading operator to not override previous items
      deletedImages.current = [
        // Update deleted images with URLs not in the current content.
        ...deletedImages.current,
        ...currentImages.current.filter(
          (url) => !currentImageUrls.includes(url),
        ),
      ];

      currentImages.current = currentImageUrls; // Update current images with new URLs.
    },
  });

  const handleDeletedImages = async (imageUrls: string[]): Promise<void> => {
    const imageNames = imageUrls.map((url: string) =>
      extractFilenameFromCloudFrontUrl(url),
    );
    // Fire and forget the promises, but handle errors properly
    imageNames.forEach((name) => {
      try {
        deleteImage(name);
      } catch (error) {
        console.error(`Failed to delete image ${name}:`, error);
      }
    });
  };

  useEffect(() => {
    // Effect to update editor content when `content` prop changes.
    if (editor) {
      const currentContent = editor.getHTML(); // Get current content from the editor.
      if (content !== currentContent) {
        // Check if the content has changed.
        editor.commands.setContent(content); // Update the editor with new content.
        const { characters, words } = editor.storage.characterCount; // Get character and word counts.
        setCharacterCount(characters); // Update character count state.
        setWordCount(words); // Update word count state.

        const currentImageUrls = extractImgUrlFromHtml(content);
        currentImages.current = currentImageUrls; // Update current images with new URLs.
      }
    }
  }, [content, editor]);

  useEffect(() => {
    // Cleanup effect to destroy the editor on component unmount.
    return () => {
      editor?.destroy(); // Destroy the editor instance.
      handleDeletedImages(deletedImages.current);
    };
  }, [editor]);

  if (!editor) return null; // Return null if the editor is not initialized.
  return (
    <div
      className={`tiptap my-2 flex max-h-fit min-h-[250px] flex-col justify-stretch ${className}`} // Main container with styling.
    >
      <div className="my-2 block">
        <Toolbar editor={editor} />
      </div>
      <EditorContent
        dir="rtl"
        className="mt-2 h-fit whitespace-pre-wrap rounded-[8px] border"
        editor={editor}
      />
      <div className="character-count">
        <p>Character Count: {characterCount}</p>
        <p>Word Count: {wordCount}</p>
      </div>
    </div>
  );
};

export default TiptapEditor;
