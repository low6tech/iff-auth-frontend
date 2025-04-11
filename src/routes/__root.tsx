import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from 'src/components/header';

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen max-w-screen flex-col overflow-hidden">
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
