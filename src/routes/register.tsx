import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from '@tanstack/react-router';
import { useForm, useStore } from '@tanstack/react-form';
import { useState } from 'react';

import { getFilledFormPercentage } from 'src/components/auth/getFilledFormPercentage.helper.ts';
import { AuthHeader } from 'src/components/auth/Header.tsx';
import { CountriesCombobox } from 'src/components/CountriesCombobox';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { submitRegister } from 'src/lib/api/methods/register';
import {
  interpolateCallbackUrl,
  isValidCallbackUrl,
} from 'src/lib/callback-url';
import { signupFormSchema } from '@/lib/schemas/signupForm.schema.ts';

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => {
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
  component: RegisterPage,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

function RegisterPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      country: '',
      isAdult: false,
      allowMarketingNotifications: false,
    },
    validators: {
      onChange: signupFormSchema,
    },
    onSubmit: async (props) => {
      try {
        await submitRegister({
          value: props.value,
          meta: {
            getCallbackUrl: (token: string) =>
              interpolateCallbackUrl(searchParams.callbackUrl, token),
            setError,
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
        <AuthHeader title="Register" percentageFilled={percentageFilled} />

        <div className="flex flex-col gap-4 py-3">
          <form.Field name="firstName">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="First name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
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

          <form.Field name="lastName">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Last name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
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

          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Email"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
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

          <form.Field name="username">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
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

          <form.Field name="country">
            {(field) => (
              <div className="flex flex-col gap-1">
                <CountriesCombobox
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
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
        </div>

        {error && (
          <p className="rounded-md bg-red-500 p-2 text-white">{error}</p>
        )}

        <div className="mt-4 grid gap-2">
          <h2 className="w-full text-2xl font-bold uppercase">Preferences</h2>

          <form.Field name="isAdult">
            {(field) => (
              <div className="flex items-center">
                <div className="flex-1">
                  <Input
                    type="checkbox"
                    className="w-5"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                </div>
                <span className="ml-2 text-sm">
                  I confirm that I am over 21 and agree to the Game Rules.
                </span>
              </div>
            )}
          </form.Field>

          <form.Field name="allowMarketingNotifications">
            {(field) => (
              <div className="flex items-center">
                <div className="flex-1">
                  <Input
                    type="checkbox"
                    className="w-5"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                </div>
                <span className="ml-2 text-sm">
                  Send me exclusive Gameweek previews and the latest news
                </span>
              </div>
            )}
          </form.Field>
        </div>

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
                Register
              </Button>
            )}
          </form.Subscribe>

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
    </section>
  );
}
