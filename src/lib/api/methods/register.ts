import { fetchClient } from '../client';
import { submitSignin } from './signin';

export const submitRegister = async ({
  value,
  meta,
}: {
  value: {
    email: string;
    password: string;
    country: string;
    firstName: string;
    lastName: string;
  };
  meta: {
    getCallbackUrl: (token: string) => string;
    setError: (error: string) => void;
  };
}) => {
  await fetchClient.POST('/user/signUp', {
    body: {
      username: value.email,
      password: value.password,
      tenantId: 'iff',
      country: value.country,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
    },
  });

  await submitSignin({
    value,
    meta,
  });
};
