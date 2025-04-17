import { z } from 'zod';

export const Email = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Invalid email' });

export const Password = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long');
