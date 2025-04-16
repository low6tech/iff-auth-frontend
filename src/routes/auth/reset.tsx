import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { submitRenewPassword } from 'src/lib/api/methods/renew-password.api.ts';
import { AuthHeader } from 'src/components/auth/Header.tsx';
import { Input } from 'src/components/ui/input.tsx';
import { Button } from 'src/components/ui/button.tsx';
import { toast } from 'sonner';
import { Loader } from 'src/components/Loader.tsx';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';

const resetSearchParamsSchema = z.object({
  token: z.string().min(1).optional(),
});

export const Route = createFileRoute('/auth/reset')({
  component: RouteComponent,
  validateSearch: (search) => resetSearchParamsSchema.parse(search),
});

const ResetFormSchema = z
  .object({
    password: z.string().min(1, 'Email is required'),
    confirm_password: z.string().min(1, 'Email is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'], // Set the path of the error to `confirm_password`
  });

function RouteComponent() {
  //* Router
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      password: '',
      confirm_password: '',
    },
    validators: {
      onChange: ResetFormSchema,
    },
    onSubmit: async (props) => {
      const password = props.value.password;

      if (!token) return toast.error('Invalid token');

      setIsLoading(true);
      try {
        // Make a request
        await submitRenewPassword({ newPassword: password, token });
      } catch (e) {
        console.error('Error:', e);
      } finally {
        setIsLoading(false);
      }

      // TODO add search params if needed
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      navigate({ to: '/' }); // Navigate to the login page
    },
  });

  return (
    <section className="py-4">
      <AuthHeader title="Reset Password" backLink="/auth/forgot-password" />

      <form className="grid gap-4">
        <p>
          Enter your email address and we will send you a link to reset your
          password.
        </p>
        {/* Password field */}
        <form.Field name="password">
          {(field) => (
            <div>
              <Input
                placeholder="Password"
                type="password"
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

        {/* Confirm Password field */}
        <form.Field name="confirm_password">
          {(field) => (
            <div>
              <Input
                placeholder="Confirm password"
                type="password"
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

        <Button disabled={isLoading} variant="primary" size="lg">
          <span>Reset password</span>
          {isLoading && <Loader className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </section>
  );
}
