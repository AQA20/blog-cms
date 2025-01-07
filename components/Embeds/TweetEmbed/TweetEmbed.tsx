import React from 'react';
import Image from 'next/image';
import { Tweet } from 'react-tweet';
import styles from './tweet.module.css';

export const TweetEmbed = ({ id }: { id: string }) => {
  const components = {
    AvatarImg: (props: any) => <Image {...props} />,
    MediaImg: (props: any) => <Image {...props} fill unoptimized />,
  };
  return (
    <div className={styles.tweetContainer}>
      <Tweet id={id} components={components} />
    </div>
  );
};
