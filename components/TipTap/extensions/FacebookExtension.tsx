import React from 'react';
import { Node } from '@tiptap/core';
import { createRoot } from 'react-dom/client';
import { FacebookEmbed } from '@/components/Embeds/FacebookEmbed/FacebookEmbed';

export const FacebookExtension = Node.create({
  name: 'facebook', // Unique name for this node
  group: 'block', // Block-level content
  atom: true, // Non-splittable node

  addAttributes() {
    return {
      postUrl: {
        default: null, // Default value for the post URL
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-facebook-post]', // Identify the HTML tag for this node
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLElement;
          return { postUrl: element.getAttribute('data-post-url') };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Render the node as HTML
    return [
      'div',
      { 'data-facebook-post': '', 'data-post-url': HTMLAttributes.postUrl },
      '',
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement('div');
      const root = createRoot(container);

      // Render the React component
      root.render(<FacebookEmbed postUrl={node.attrs.postUrl} />);

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
