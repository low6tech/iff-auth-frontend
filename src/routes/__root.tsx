import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from 'src/components/header';
import { LOCAL_STORAGE_TOKEN_KEY } from 'src/constants/local-storage';
import {
  getSearchCallbackUrlTemplate,
  interpolateCallbackUrl,
} from 'src/lib/callback-url';
import { Logo } from 'src/components/Logo.tsx';

export const Route = createRootRoute({
  //? Immediately redirect to callback with stored token if present
  beforeLoad: (ctx) => {
    // Skip signout route because removes the stored token after this hook runs
    if (ctx.matches.some((x) => x.fullPath === '/signout')) {
      return;
    }

    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!token) return;

    const callbackUrlTemplate = getSearchCallbackUrlTemplate(
      ctx.location.search
    );

    if (!callbackUrlTemplate) return;

    const callbackUrl = interpolateCallbackUrl(callbackUrlTemplate, token);

    window.location.replace(callbackUrl);
  },

  component: () => (
    <div className="flex min-h-screen max-w-screen flex-col overflow-hidden">
      <Header />

      <>
        {/* Mobile */}
        <div className='block md:hidden px-4 h-full bg-foreground'>
          <Outlet />
        </div>

        {/* Desktop */}
        <div className='hidden md:block min-h-svh h-full'>
          <div className='grid grid-cols-2 grid-items-center h-full min-h-svh relative'>
            <div className='px-20 z-10'>
              <Outlet />
            </div>

            <div className='h-full relative'>
              <img
                src='/images/desktop-bg-image.png'
                alt='players'
                className='h-full object-cover object-right'
              />

              <div className='h-full w-full absolute top-0 right-0 z-0'>
                  <div className='bg-background opacity-45 h-full w-full absolute top-0 right-0' />

                    <Logo className='z-30 md:w-72 lg:w-80 absolute right-1/4 top-1/2 -translate-y-1/2' />
              </div>

            </div>
          </div>
        </div>
      </>

      <TanStackRouterDevtools />
    </div>
  ),
});
