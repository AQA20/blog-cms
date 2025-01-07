import React from 'react';
import { Node } from '@tiptap/core';
import { createRoot } from 'react-dom/client';
import { Loader2 } from 'lucide-react';

export const LoadingImageExtension = Node.create({
  name: 'loadingImage', // Unique name for this node
  group: 'block', // Block-level content
  atom: true, // Non-splittable node

  parseHTML() {
    return [
      {
        tag: 'div[loading-img]', // Identify the HTML tag for this node
      },
    ];
  },

  renderHTML() {
    // Render the node as HTML
    return ['div', { 'loading-img': '' }];
  },

  addNodeView() {
    return () => {
      const container = document.createElement('div');
      const root = createRoot(container);

      // Render the React component
      root.render(
        <div className="h-270 flex w-full items-center justify-center rounded-[8px] border sm:h-[510px] sm:w-[680px]">
          <div>
            <Loader2 className="animate-spin text-primary" size={75} />
            <p>Loading...</p>
          </div>
        </div>,
      );

      return {
        dom: container,
        destroy: () => {
          // Clean up React root on destroy
          setTimeout(() => {
            root.unmount();
          });
        },
      };
    };
  },
});
