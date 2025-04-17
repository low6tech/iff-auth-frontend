import { z } from 'zod';
import { Email, Password } from '@/lib/schemas/user.ts';

export const signupFormSchema = z.object({
  firstName: z.string({ required_error: 'First name is required' }),
  lastName: z.string({ required_error: 'Last name is required' }),
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

  isAdult: z.literal(true, {
    invalid_type_error: 'You must confirm you are an adult to continue',
  }),
  allowMarketingNotifications: z.boolean(),
});
