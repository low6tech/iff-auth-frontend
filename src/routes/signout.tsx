import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/signout')({
  component: RouteComponent,
  beforeLoad: async ({ search }) => {
    localStorage.removeItem('token');

    if ('callbackUrl' in search && typeof search.callbackUrl === 'string') {
      throw redirect({ to: '/', search: { callbackUrl: search.callbackUrl } });
    }
  },
});

function RouteComponent() {
  return <div>Signed out.</div>;
}
