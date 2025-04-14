import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from 'src/components/header';
import { LOCAL_STORAGE_TOKEN_KEY } from 'src/constants/local-storage';
import {
  getSearchCallbackUrlTemplate,
  interpolateCallbackUrl,
} from 'src/lib/callback-url';

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
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
