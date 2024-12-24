import { type Editor } from '@tiptap/react';
import { useCallback } from 'react';

interface TipTapEditorSetters {
  setImage: (url: string, alt: string, name: string) => void;
  setLoadingImage: () => void;
  setLink: (url: string) => void;
  setYoutubeVideo: (src: string) => void;
  setTweet: (tweetId: string) => void;
  setFbPost: (postUrl: string) => void;
  setInstaPost: (postUrl: string) => void;
  setQuote: (quote: string, setQuoteB: string) => void;
}

export const useTipTapEditorSetters = (
  editor: Editor | null,
): TipTapEditorSetters => {
  const setImage = useCallback(
    (url: string, alt: string, name: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: url,
            alt,
            'data-name': name,
          },
        })
        .run();
    },
    [editor],
  );
  const setLoadingImage = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'loadingImage',
      })
      .run();
  }, [editor]);

  const setLink = useCallback(
    (url: string) => {
      if (!editor) return;

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    },
    [editor],
  );

  const setYoutubeVideo = useCallback(
    (src: string) => {
      if (!editor) return;
      editor.commands.setYoutubeVideo({
        src,
        width: 640,
        height: 480,
      });
    },
    [editor],
  );

  const setTweet = useCallback(
    (tweetId: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'tweet',
          attrs: { id: tweetId },
        })
        .run();
    },
    [editor],
  );

  const setFbPost = useCallback(
    (postUrl: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'facebook',
          attrs: { postUrl },
        })
        .run();
    },
    [editor],
  );

  const setInstaPost = useCallback(
    (postUrl: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'instagram',
          attrs: { postUrl },
        })
        .run();
    },
    [editor],
  );
  const setQuote = useCallback(
    (quote: string, quoteBy: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'quote',
          attrs: { quote, quoteBy },
        })
        .run();
    },
    [editor],
  );

  return {
    setImage,
    setLoadingImage,
    setLink,
    setYoutubeVideo,
    setTweet,
    setFbPost,
    setInstaPost,
    setQuote,
  };
};
