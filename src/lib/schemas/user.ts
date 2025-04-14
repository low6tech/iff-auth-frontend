import { z } from 'zod';

export const Email = z.string().email().nonempty('Email is required');

export const Password = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long');
