import { fetchClient } from '../client';
import { submitSignin } from './signin';

export const submitRegister = async ({
  value,
  meta,
}: {
  value: {
    username: string;
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
      username: value.username,
      email: value.email,
      password: value.password,
      tenantId: 'iff',
      country: value.country,
      firstName: value.firstName,
      lastName: value.lastName,
    },
  });

  await submitSignin({
    value,
    meta,
  });
};
