import React from 'react';
import Image from 'next/image';
import { Tweet } from 'react-tweet';
import './tweet.css';

export const TweetComponent = ({ id }: { id: string }) => {
  const components = {
    AvatarImg: (props: any) => <Image {...props} />,
    MediaImg: (props: any) => <Image {...props} fill unoptimized />,
  };
  return (
    <div className="tweet-container">
      <Tweet id={id} components={components} />
    </div>
  );
};
