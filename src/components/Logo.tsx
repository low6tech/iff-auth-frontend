import { cn } from 'src/lib/utils.ts';

export const Logo = ({ className }: { className?: string }) => (
  <img
    src="/images/client-logo.svg"
    alt=""
    className={cn('w-[140px]', className)}
  />
);