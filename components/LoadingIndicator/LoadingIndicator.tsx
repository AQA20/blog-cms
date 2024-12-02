import { Loader2 } from 'lucide-react';
import React from 'react';

export const LoadingIndicator = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
        <Loader2 className="animate-spin text-primary" size={75} />
        <p>Loading...</p>
      </div>
    </div>
  );
};
