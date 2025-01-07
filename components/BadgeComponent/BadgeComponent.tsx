'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export const BadgeComponent: React.FC<Props> = ({
  name,
  children,
  className,
}) => {
  return (
    <Badge
      variant="outline"
      className={`text-body-md border-outlineVariant text-onSurfaceVariant flex min-w-fit justify-between gap-2 font-normal ${className}`}
    >
      {children}
      {name}
    </Badge>
  );
};
