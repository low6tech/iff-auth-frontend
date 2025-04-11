import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { CountriesCombobox } from 'src/components/CountriesCombobox';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { fetchClient } from 'src/lib/api/client';
import {
  interpolateUrlTemplate,
  validateUrlTemplate,
} from 'src/lib/url-template';

const TOKEN_URL_TEMPLATE_KEY = 'token' as const;

export const Route = createFileRoute('/register')({
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
  component: RegisterPage,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

const interpolateSigninCallbackUrl = interpolateUrlTemplate<
  typeof TOKEN_URL_TEMPLATE_KEY
>;

function RegisterPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();

  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');

  // Immediately redirect when a token is saved
  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) return;

    const callbackUrl = interpolateSigninCallbackUrl(searchParams.callbackUrl, {
      token,
    });

    window.location.replace(callbackUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSignin = async () => {
    const { data, response } = await fetchClient.POST('/user/signIn', {
      body: {
        username: email,
        password,
        token: {
          payloadFields: ['id', 'username'],
        },
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

    const callbackUrl = interpolateSigninCallbackUrl(searchParams.callbackUrl, {
      token,
    });

    window.location.replace(callbackUrl);
  };

  const onRegister = async () => {
    await fetchClient.POST('/user/signUp', {
      body: {
        username,
        password,
        tenantId: 'iff',
        country,
        email,
        firstName,
        lastName,
      },
    });

    await onSignin();
  };

  return (
    <div className="grid flex-1 place-items-center">
      <div className="bg-popover container mx-auto flex h-full flex-col overflow-hidden p-3 sm:h-fit sm:max-w-md sm:rounded-lg sm:p-4">
        <div className="flex flex-col gap-4 py-3">
          <h2 className="text-2xl font-bold">Register</h2>

          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <CountriesCombobox
            value={country}
            onChange={(value) => setCountry(value)}
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-500 p-2 text-white">{error}</p>
        )}

        <div className="flex flex-col gap-2 py-3">
          <Button
            disabled={!email || !password || !username || !country}
            variant="primary"
            size="lg"
            onClick={onRegister}
          >
            Register
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              navigate({
                to: '/',
                search: { callbackUrl: searchParams.callbackUrl },
              });
            }}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
