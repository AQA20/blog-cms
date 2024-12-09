import { type Editor } from '@tiptap/react';
import { useCallback } from 'react';

interface TipTapEditorSetters {
  setImage: (event: React.ChangeEvent<HTMLInputElement>, alt: string) => void;
  setLink: (url: string) => void;
  setYoutubeVideo: (src: string) => void;
  setTweet: (tweetId: string) => void;
  setFbPost: (postUrl: string) => void;
}

export const useTipTapEditorSetters = (
  editor: Editor | null,
): TipTapEditorSetters => {
  const setImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, alt: string) => {
      if (!editor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          editor
            .chain()
            .focus()
            .setImage({
              src: reader.result as string,
              alt,
            })
            .run();
        }
      };
      reader.readAsDataURL(file); // Convert image to Base64
    },
    [editor],
  );

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

  return { setImage, setLink, setYoutubeVideo, setTweet, setFbPost };
};
