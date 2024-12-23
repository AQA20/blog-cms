'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { Toolbar } from '@/components/TipTap/Toolbar';
import { useAppEditorConfig } from '@/hooks/useAppEditorConfig';
import './styles/editor.css';

const TiptapEditor = ({
  className,
  content,
  onChange,
}: {
  content: string;
  className: string;
  onChange: (richText: string) => void;
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const { editorConfig } = useAppEditorConfig();
  const editor: Editor | null = useEditor({
    ...editorConfig,
    content,
    editorProps: {
      attributes: {
        class:
          'rounded-md border border-input focus:border-input border-border px-3 py-8 min-h-[200px] space-y-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      },
      handlePaste: (view, event) => {
        // Get the clipboard data
        const clipboardData = event.clipboardData;
        let pastedText = clipboardData?.getData('text');

        // Insert the plain text content into the editor
        if (pastedText) {
          // Remove new lines and extra spaces
          pastedText = pastedText.replace(/\n\s*\n*/g, '\n').trim();
          editor?.commands.insertContent(pastedText);
        }

        return true; // Returning true ensures other handlers don't interfere
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
      // Update counts
      const { characters, words } = editor.storage.characterCount;
      setCharacterCount(characters);
      setWordCount(words);
    },
  });

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.insertContent(content); // Update only if content has changed
      }
    }
  }, [content]);

  return (
    <div
      className={`tiptap my-2 flex max-h-fit min-h-[250px] flex-col justify-stretch ${className}`}
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
