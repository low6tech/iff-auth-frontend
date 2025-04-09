import { cn } from 'src/lib/utils';
import React from 'react';

export const Loader = React.memo(
  (props: { className?: string; size?: string }) => (
    <div
      className={cn(
        'inline-flex flex-none items-center justify-between gap-[0.318em] px-[0.318em]',
        props.className
      )}
      style={{
        fontSize: props.size,
        // Simulates the height of a text element at font-size: 1em
        height: '1.43em',
      }}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex-none animate-pulse rounded-full bg-white"
          style={{
            height: '1em',
            width: '1em',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
);
