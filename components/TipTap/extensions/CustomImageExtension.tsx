import Image from '@tiptap/extension-image';

// Extend the default Image extension from TipTap
export const CustomImage = Image.extend({
  // Override the addAttributes method to add custom attributes
  addAttributes() {
    return {
      // Include the attributes from the parent class
      ...this.parent?.(),
      // Add a new attribute 'data-name'
      'data-name': {
        // Set the default value to null
        default: null,
        // Define how to parse the 'data-name' attribute from HTML
        parseHTML: (element) => element.getAttribute('data-name'),
        // Define how to render the 'data-name' attribute to HTML
        renderHTML: (attributes) => {
          // If 'data-name' is not set, return an empty object
          if (!attributes['data-name']) {
            return {};
          }
          // Otherwise, return an object with the 'data-name' attribute
          return { 'data-name': attributes['data-name'] };
        },
      },
    };
  },
});
