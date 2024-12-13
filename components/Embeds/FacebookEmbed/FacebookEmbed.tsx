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

export const FacebookEmbed = ({ postUrl }: { postUrl: string }) => {
  const breakpoint = useBreakpoint();
  const [key, setKey] = useState(0); // Key to force re-render
  useEffect(() => {
    if (!window.FB) {
      const script = document.createElement('script');
      script.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    } else {
      // Parse Facebook widget after re-render
      window.FB.XFBML.parse();
    }
  }, [key]);

  useEffect(() => {
    // Force re-render on breakpoint change
    setKey((prev) => prev + 1);
  }, [breakpoint]);

  const width = breakpoint === 'sm' ? '100%' : '680';
  const height = breakpoint === 'sm' ? '229' : '510';

  return (
    <div
      key={key}
      className={`rounded-[8px] ${postUrl.includes('watch') ? 'fb-video' : 'fb-post'}`}
      data-href={postUrl}
      data-width={width}
      data-height={height}
      data-show-text={false}
      data-show-control="true"
      data-allowfullscreen="true"
    >
      <blockquote cite={postUrl} className="fb-xfbml-parse-ignore">
        <div className="flex h-[229px] w-full items-center justify-center rounded-[8px] border md:h-[510px] md:w-[680px]">
          Loading...
        </div>
      </blockquote>
    </div>
  );
};
