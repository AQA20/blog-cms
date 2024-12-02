'use client';

import React, { useEffect, useRef, useState } from 'react';
import EditorJS, {
  type OutputData,
  type BlockToolConstructable,
} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

// Ensure tools implement BlockToolConstructable
const HeaderTool = Header as unknown as BlockToolConstructable;
const ListTool = List as unknown as BlockToolConstructable;

const Editor = ({
  data,
  onChange,
}: {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
}) => {
  const [isClient, setIsClient] = useState(false);
  const editorInstance = useRef<EditorJS | null>(null);

  const initialData = data || {
    time: new Date().getTime(),
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Title',
          level: 1,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Default description goes here.',
        },
      },
      {
        type: 'header',
        data: {
          text: 'Subtitle (H2)', // Subtitle as header
          level: 2, // <h2> (header 2)
        },
      },
      {
        type: 'header',
        data: {
          text: 'Subsection (H3)', // Subsection as header
          level: 3, // <h3> (header 3)
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'This is the article content area. Add your text here.',
        },
      },
    ],
  };

  // Ensures we are running client-side code
  useEffect(() => {
    setIsClient(true); // Set to true after the first render (client side)
  }, []);

  useEffect(() => {
    if (!isClient) return; // Skip if not client-side

    // Initialize the EditorJS instance only on the client
    editorInstance.current = new EditorJS({
      holder: 'editorjs',
      data: initialData,
      tools: {
        header: {
          class: HeaderTool,
          inlineToolbar: ['link'],
          config: {
            levels: [1, 2, 3], // Include <h1>, <h2>, <h3> levels
            placeholder: 'Enter a header',
          },
        },
        list: {
          class: ListTool,
          inlineToolbar: true,
        },
      },
      onChange: async () => {
        const content = await editorInstance.current?.save();
        onChange?.(content as OutputData);
      },
    });

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [isClient, data, onChange]);

  if (!isClient) return <div>Loading Editor...</div>;

  return <div id="editorjs" />;
};

export default Editor;
