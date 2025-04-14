import { LOCAL_STORAGE_TOKEN_KEY } from 'src/constants/local-storage';
import { fetchClient } from '../client';

export const signin = async (
  values: {
    email: string;
    password: string;
  },
  params: {
    getCallbackUrl: (token: string) => string;
    setError: (error: string) => void;
  }
) => {
  const { data, response } = await fetchClient.POST('/user/signIn', {
    body: {
      username: values.email,
      password: values.password,
      token: {
        payloadFields: ['id', 'username'],
      },
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

  const token = response.headers.get('token');

  if (!token) {
    params.setError('Failed to retrieve token. Please try again.');
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

  const callbackUrl = params.getCallbackUrl(token);

  window.location.replace(callbackUrl);
};
