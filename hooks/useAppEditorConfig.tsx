import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Youtube from '@tiptap/extension-youtube';
import { useRef } from 'react';
import { TweetExtension } from '@/components/TipTap/extensions/TweetExtension';
import { FacebookExtension } from '@/components/TipTap/extensions/FacebookExtension';
import { InstagramExtension } from '@/components/TipTap/extensions/InstagramExtension';
import { BlockquoteExtension } from '@/components/TipTap/extensions/BlockquoteExtension';
import { LoadingImageExtension } from '@/components/TipTap/extensions/LoadingImageExtension';
import { CustomImage } from '@/components/TipTap/extensions/CustomImageExtension';

export const useAppEditorConfig = () => {
  const editorConfig = useRef({
    extensions: [
      StarterKit,
      TweetExtension,
      FacebookExtension,
      InstagramExtension,
      BlockquoteExtension,
      CustomImage,
      LoadingImageExtension,
      Placeholder.configure({
        placeholder: 'محتوى المقال هنا...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
      CharacterCount.configure(),
      Underline,
      Youtube.configure({
        inline: false,
        controls: false,
        nocookie: true,
        modestBranding: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto'];
            const protocol = parsedUrl.protocol.replace(':', '');

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === 'string' ? p : p.scheme,
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              'example-phishing.com',
              'malicious-site.net',
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
      }),
    ],
    immediatelyRender: false,
    injectCSS: false,
  });

  return { editorConfig: editorConfig.current };
};
