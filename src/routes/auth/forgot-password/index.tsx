import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthHeader } from 'src/components/auth/Header.tsx';
import { Input } from 'src/components/ui/input.tsx';
import { Button } from 'src/components/ui/button.tsx';
import { Loader } from 'src/components/Loader.tsx';
import { submitForgotPassword } from 'src/lib/api/methods/forgot-password.api.ts';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';

export const Route = createFileRoute('/auth/forgot-password/')({
  component: ForgotPassword,
});

const ResetFormSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
});

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: ResetFormSchema,
    },
    onSubmit: async (props) => {
      setIsLoading(true);
      try {
        await submitForgotPassword({ email: props.value.email });

        toast.success('Password reset link sent', {
          description: 'Please check your email for a password reset link',
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <section className="py-4">
      <AuthHeader title="Forgot Password" backLink="/" />

      <div className="grid gap-4">
        <p>
          Enter your email address and we will send you a link to reset your
          password.
        </p>
        <form.Field name="email">
          {(field) => (
            <div className="grid gap-1">
              <Input
                placeholder="Email address"
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

        <Button
          disabled={isLoading}
          type="submit"
          variant="primary"
          size="lg"
          onClick={form.handleSubmit}
        >
          <span>Reset password</span>
          {isLoading && <Loader className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </section>
  );
}
