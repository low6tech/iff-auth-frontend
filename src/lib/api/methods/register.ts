import { fetchClient } from '../client';
import { signin } from './signin';

export const register = async (
  values: {
    email: string;
    password: string;
    country: string;
    firstName: string;
    lastName: string;
  },
  params: {
    getCallbackUrl: (token: string) => string;
    setError: (error: string) => void;
  }
) => {
  const { data } = await fetchClient.POST('/user/signUp', {
    body: {
      username: values.email,
      password: values.password,
      tenantId: 'iff',
      country: values.country,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
    },
  });

  const errorMessage =
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof data.error === 'string'
      ? data.error
      : null;

  if (errorMessage) {
    params.setError(errorMessage);

    return;
  }

  await signin(
    {
      email: values.email,
      password: values.password,
    },
    {
      getCallbackUrl: params.getCallbackUrl,
      setError: params.setError,
    }
  );
};
