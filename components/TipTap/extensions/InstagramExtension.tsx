import React from 'react';
import { Node } from '@tiptap/core';
import { createRoot } from 'react-dom/client';
import { InstagramEmbed } from '@/components/Embeds/InstagramEmbed/InstagramEmbed';

export const InstagramExtension = Node.create({
  name: 'instagram', // Unique name for this node
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
        tag: 'div[data-insta-post]', // Identify the HTML tag for this node
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLElement;
          return { postUrl: element.getAttribute('data-instgrm-permalink') };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Render the node as HTML
    return [
      'div',
      {
        'data-insta-post': '',
        'data-instgrm-permalink': HTMLAttributes.postUrl,
      },
      '',
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement('div');
      const root = createRoot(container);

      // Render the React component
      root.render(<InstagramEmbed postUrl={node.attrs.postUrl} />);

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
