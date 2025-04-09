import ClientLogo from 'src/assets/client-logo.svg';

import { ArrowLeft } from 'lucide-react';

export const Header = () => {
  return (
    <header>
      <div className="relative flex h-16 items-center py-3">
        <div className="flex flex-1 px-4">
          <a
            href={import.meta.env.VITE_APP_ROOT_BACK_BUTTON_URL}
            className="text-accent-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </a>
        </div>

        <img
          src={ClientLogo}
          alt=""
          className="absolute left-1/2 w-[140px] -translate-x-1/2"
        />
      </div>
    </header>
  );
};
