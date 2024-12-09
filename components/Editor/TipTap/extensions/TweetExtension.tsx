import React from 'react';
import { Node } from '@tiptap/core';
import { createRoot } from 'react-dom/client';
import { TweetComponent } from '@/components/Embeds/TweetComponent/TweetComponent';

export const TweetExtension = Node.create({
  name: 'tweet', // Unique name for this node type
  group: 'block', // Indicates this is a block-level element
  atom: true, // Means this node can't be split or merged

  addAttributes() {
    return {
      id: {
        default: null, // Define an 'id' attribute with null default value
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-tweet]', // Look for divs with data-tweet attribute
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLElement;
          return { id: element.getAttribute('data-tweet') }; // Extract tweet ID
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Define how the node is rendered to HTML
    return ['div', { 'data-tweet': HTMLAttributes.id }, ''];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement('div');
      container.className = 'tweet-container';

      // Create a root once and reuse it
      const root = createRoot(container);
      // Render the React component
      root.render(<TweetComponent id={node.attrs.id} />);

      return {
        dom: container,
        destroy: () => {
          // Ensure unmount only happens when not rendering
          setTimeout(() => {
            root.unmount();
          });
        },
      };
    };
  },
});
