import { LOCAL_STORAGE_TOKEN_KEY } from 'src/constants/local-storage';
import { fetchClient } from '../client';

export const submitSignin = async ({
  value,
  meta,
}: {
  value: {
    email: string;
    password: string;
  };
  meta: {
    getCallbackUrl: (token: string) => string;
  };
}) => {
  const { response } = await fetchClient.POST('/user/signIn', {
    body: {
      email: value.email,
      password: value.password,
      token: {
        payloadFields: ['id', 'username'],
      },
    },
  });

  if (response.status >= 400 && response.status < 500) {
    throw new Error('Email or password is incorrect.');
  }

  const token = response.headers.get('token');

  if (!token) {
    throw new Error('Failed to retrieve token. Please try again.');
  }

  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

  const callbackUrl = meta.getCallbackUrl(token);

  window.location.replace(callbackUrl);
};
