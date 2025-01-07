'use client';

import React from 'react';
import Image from 'next/image';

interface RoundedImageProps {
  src: string;
  width: number;
  height: number;
  priority?: boolean;
  alt?: string;
  onClick?: () => void;
}

const RoundedImage: React.FC<RoundedImageProps> = ({
  src,
  width,
  height,
  priority = false,
  alt = '',
  onClick = () => null,
}) => {
  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="overflow-hidden rounded-lg"
    >
      <Image
        onClick={onClick}
        width={width}
        height={height}
        src={src}
        alt={alt}
        className="h-full w-full cursor-pointer object-cover"
        priority={priority}
      />
    </div>
  );
};

export default RoundedImage;
