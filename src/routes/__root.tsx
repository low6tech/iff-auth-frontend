import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from 'src/components/header';
import { LOCAL_STORAGE_TOKEN_KEY } from 'src/constants/local-storage';
import {
  getSearchCallbackUrlTemplate,
  interpolateCallbackUrl,
} from 'src/lib/callback-url';
import { Logo } from 'src/components/Logo.tsx';
import { Toaster } from 'src/components/ui/sonner';

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
        <div className="bg-foreground block h-full px-4 md:hidden">
          <Outlet />
        </div>

        {/* Desktop */}
        <div className="hidden h-full min-h-svh md:block">
          <div className="grid-items-center relative grid h-full min-h-svh grid-cols-2">
            <div className="z-10 px-20">
              <Outlet />
            </div>

            <div className="relative h-full">
              <img
                src="/images/desktop-bg-image.png"
                alt="players"
                className="h-full object-cover object-right"
              />

              <div className="absolute top-0 right-0 z-0 h-full w-full">
                <div className="bg-background absolute top-0 right-0 h-full w-full opacity-45" />

                <Logo className="absolute top-1/2 right-1/4 z-30 -translate-y-1/2 md:w-72 lg:w-80" />
              </div>
            </div>
          </div>
        </div>
      </>

      <Toaster richColors />

      <TanStackRouterDevtools />
    </div>
  ),
});
