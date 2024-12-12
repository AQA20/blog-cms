import React from 'react';
import { Node } from '@tiptap/core';
import { createRoot } from 'react-dom/client';
import { Blockquote } from '@/components/Blockquote/Blockquote';

export const BlockquoteExtension = Node.create({
  name: 'quote', // Unique name for this node
  group: 'block', // Block-level content
  atom: true, // Non-splittable node

  addAttributes() {
    return {
      quote: {
        default: '', // Default value for the quote
      },
      quoteBy: {
        default: '', // Default value for the quoteBy
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-quote]', // Identify the HTML tag for this node
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLElement;
          return {
            quote: element.getAttribute('data-quote-content'),
            quoteBy: element.getAttribute('data-quote-by'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Render the node as HTML
    return [
      'div',
      {
        'data-quote': '',
        'data-quote-content': HTMLAttributes.quote,
        'data-quote-by': HTMLAttributes.quoteBy,
      },
      '',
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement('div');
      const root = createRoot(container);

      // Render the React component
      root.render(
        <Blockquote quote={node.attrs.quote} quoteBy={node.attrs.quoteBy} />,
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
