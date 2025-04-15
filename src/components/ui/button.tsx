import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'src/lib/utils';
import { Loader } from 'src/components/Loader';

//? To replace the button in src/ui/button.tsx. Remove comment when done.

const buttonVariants = cva(
  'group inline-flex cursor-pointer disabled:cursor-auto overflow-hidden items-center select-none justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-white transition-colors ease-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground border-b-[4px]',
        secondary:
          'bg-secondary text-secondary-foreground border-b-[4px] border-[lighten(--color-secondary, 50%)]',
        input: 'border border-input bg-white text-muted-foreground font-normal',
      },
      size: {
        md: 'px-4 h-9',
        lg: 'px-6 h-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, ...props },
    ref
  ) => {
    const Comp = loading ? 'button' : asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          props.disabled && 'opacity-50'
        )}
        ref={ref}
        {...props}
        disabled={props.disabled || loading}
        children={loading ? <Loader /> : props.children}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
