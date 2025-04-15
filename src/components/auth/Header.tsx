import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

import { cn } from 'src/lib/utils.ts';

type Props = {
  backLink?: string;
  percentageFilled?: number;
  title: string;
};

export const AuthHeader = ({
  backLink,
  percentageFilled = 0,
  title,
}: Props) => {
  const width = isNaN(percentageFilled) ? '0%' : `${percentageFilled}%`;
  return (
    <>
      <div className='bg-[#C5D0D4] h-1.5 w-full rounded-lg'>
        <div
          className='bg-primary h-full rounded-lg duration-1000 transition-all ease-in-out'
          style={{
            width,
          }}
        />
      </div>
      <div className={cn('relative h-12 flex items-center gap-2 text-black')}>
        {/* Back Button to /auth/login */}
        {backLink && (
          <Link
            to={backLink}
            className={cn(
              'group flex h-full w-10 items-center justify-center rounded-full transition-all ease-in md:h-fit md:justify-start md:hover:bg-transparent md:active:bg-transparent'
            )}
          >
            <ChevronLeft className='h-6 w-6 transition-all ease-in hover:-translate-x-1' />
          </Link>
        )}

        <h2 className='text-2xl font-bold uppercase w-full'>{title}</h2>
      </div>
    </>
  );
};
