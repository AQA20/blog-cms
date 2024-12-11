import React, { useEffect, useState } from 'react';
import { createBreakpoint } from 'react-use';

const useBreakpoint = createBreakpoint({
  sm: 640,
  // => @media (min-width: 640px) { ... }
  md: 768,
  // => @media (min-width: 768px) { ... }
  lg: 1024,
  // => @media (min-width: 1024px) { ... }
  xl: 1280,
  // => @media (min-width: 1280px) { ... }
  '2xl': 1536,
});

export const InstagramEmbed = ({ postUrl }: { postUrl: string }) => {
  const breakpoint = useBreakpoint();
  const [key, setKey] = useState(0); // Key to force re-render
  useEffect(() => {
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // Parse Instagram widget after re-render
      window.instgrm.Embeds.process();
    }
  }, [key]);

  useEffect(() => {
    // Force re-render on breakpoint change
    setKey((prev) => prev + 1);
  }, [breakpoint]);

  const width = breakpoint === 'sm' ? '100vw' : '680px';

  return (
    <div className="my-4" key={key}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          maxWidth: '100%',
          width,
        }}
      >
        <div
          className="flex h-[300px] w-full items-center justify-center rounded-[8px] border md:h-[510px] md:w-[680px]"
          style={{ height: breakpoint === 'sm' ? '300px' : '510px' }}
        >
          Loading...
        </div>
      </blockquote>
    </div>
  );
};
