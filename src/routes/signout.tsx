import { createFileRoute, redirect } from '@tanstack/react-router';
import { LOCAL_STORAGE_TOKEN_KEY } from 'src/constants/local-storage';
import { getSearchCallbackUrlTemplate } from 'src/lib/callback-url';

export const Route = createFileRoute('/signout')({
  component: RouteComponent,
  beforeLoad: async ({ search }) => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);

    const callbackUrlTemplate = getSearchCallbackUrlTemplate(search);

    if (!callbackUrlTemplate) return;

    throw redirect({
      to: '/',
      search: { callbackUrl: callbackUrlTemplate },
    });
  },
});

function RouteComponent() {
  return <div>Signed out.</div>;
}
