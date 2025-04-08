import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { fetchClient } from 'src/lib/api/client';
import {
  interpolateUrlTemplate,
  validateUrlTemplate,
} from 'src/lib/url-template';

const TOKEN_URL_TEMPLATE_KEY = 'token' as const;

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => {
    const callbackUrl = search.callbackUrl;

    if (
      !callbackUrl ||
      typeof callbackUrl !== 'string' ||
      !validateUrlTemplate(callbackUrl, [TOKEN_URL_TEMPLATE_KEY])
    ) {
      throw new Error(
        'callbackUrl must be a valid URL with a `token` placeholder.'
      );
    }

    return {
      callbackUrl,
    };
  },
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

const interpolateSigninCallbackUrl = interpolateUrlTemplate<
  typeof TOKEN_URL_TEMPLATE_KEY
>;

function RouteComponent() {
  const searchParams = Route.useSearch();

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectWithToken = (token: string) => {
    const callbackUrl = interpolateSigninCallbackUrl(searchParams.callbackUrl, {
      token,
    });

    window.location.replace(callbackUrl);
  };

  // Immediately redirect when a token is saved
  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) return;

    redirectWithToken(token);
  }, []);

  const onSignin = async () => {
    const { data, response } = await fetchClient.POST('/user/signIn', {
      body: {
        username: email,
        password,
      },
      headers: {
        'x-tenant-id': 'iff',
      },
    });

    const errorMessage =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof data.error === 'string'
        ? data.error
        : null;

    if (errorMessage) {
      setError(errorMessage);

      return;
    }

    const token = response.headers.get('token');

    if (!token) {
      setError('Failed to retrieve token. Please try again.');
      return;
    }

    localStorage.setItem('jwt', token);

    redirectWithToken(token);
  };

  const onRegister = async () => {
    await fetchClient.POST('/user/signUp', {
      body: {
        username: email,
        password,
        tenantId: 'iff',

        // TODO: add fields during registration for these
        firstName: '',
        lastName: '',
      },
      headers: {
        'x-tenant-id': 'iff',
      },
    });

    await onSignin();
  };

  return (
    <div className="grid flex-1 place-items-center">
      <div className="bg-popover container mx-auto flex h-full flex-col p-3 sm:h-fit sm:max-w-md sm:rounded-lg sm:p-4">
        <div className="flex flex-col gap-4 py-3">
          <h2 className="text-2xl font-bold">Sign in</h2>

          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-500 p-2 text-white">{error}</p>
        )}

        <div className="flex flex-col gap-2 py-3">
          <Button
            variant="primary"
            size="lg"
            // disabled={!email || !password}
            onClick={onSignin}
          >
            Sign in
          </Button>

          <Button variant="secondary" size="lg" onClick={onRegister}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
