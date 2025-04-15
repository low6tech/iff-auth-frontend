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
import { z } from 'zod';
import { submitRegister } from 'src/lib/api/methods/register';
import { Email, Password } from 'src/lib/schemas/user';
import {
  interpolateCallbackUrl,
  isValidCallbackUrl,
} from 'src/lib/callback-url';

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

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: Email,
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Must only contain letters, numbers, underscores, or hyphens'
    ),
  password: Password,
  country: z.string().min(1, 'Country is required'),
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
    },
    validators: {
      onChange: registrationSchema,
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
  console.log("=>(register.tsx:91) form", form.state);


  const state = useStore(form.store, state => state)
  const percentageFilled = getFilledFormPercentage(state.values);

  return (
    <section className="h-full py-8 flex justify-center">
      <div className='w-full max-w-96'>
        <AuthHeader title='Register' percentageFilled={percentageFilled} />

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
