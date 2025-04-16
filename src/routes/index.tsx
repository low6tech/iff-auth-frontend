import { useForm, useStore } from '@tanstack/react-form';
import {
  createFileRoute,
  ErrorComponent,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import { useState } from 'react';

import { AuthHeader } from 'src/components/auth/Header.tsx';
import { getFilledFormPercentage } from 'src/components/auth/getFilledFormPercentage.helper.ts';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { submitSignin } from 'src/lib/api/methods/signin';
import {
  isValidCallbackUrl,
  interpolateCallbackUrl,
} from 'src/lib/callback-url';
import { Email, Password } from 'src/lib/schemas/user';
import { z } from 'zod';

export const Route = createFileRoute('/')({
  validateSearch: (search) => {
    const callbackUrl = search.callbackUrl;

    if (!isValidCallbackUrl(callbackUrl)) {
      throw new Error(
        'callbackUrl must be a valid URL with a `token` placeholder.'
      );
    }

    return {
      callbackUrl,
    };
  },
  component: SignInPage,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

const signinSchema = z.object({
  email: Email,
  password: Password,
});

function SignInPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: signinSchema,
    },
    onSubmit: async (props) => {
      try {
        await submitSignin({
          value: props.value,
          meta: {
            getCallbackUrl: (token: string) =>
              interpolateCallbackUrl(searchParams.callbackUrl, token),
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }

        throw error;
      }
    },
  });

  const state = useStore(form.store, (state) => state);
  const percentageFilled = getFilledFormPercentage(state.values);

  return (
    <section className="flex h-full justify-center py-8">
      <div className="w-full max-w-96">
        <AuthHeader title="Sign in" percentageFilled={percentageFilled} />

        <div className="flex flex-col gap-4 py-3">
          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Email"
                  type="email"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />

                {field.state.meta.isTouched && field.state.meta.errors[0] && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {error && (
            <p className="rounded-md bg-red-500 p-2 text-white">{error}</p>
          )}

          {/* Forgot password */}
          <Link
            to="/auth/forgot-password"
            className="text-xs uppercase underline hover:no-underline"
          >
            Forgot Password?
          </Link>

          <div className="flex flex-col gap-2 py-3">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={form.handleSubmit}
                  loading={isSubmitting}
                  disabled={!state.isDirty || !state.isFormValid}
                >
                  Sign in
                </Button>
              )}
            </form.Subscribe>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                navigate({
                  to: '/register',
                  search: { callbackUrl: searchParams.callbackUrl },
                });
              }}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
