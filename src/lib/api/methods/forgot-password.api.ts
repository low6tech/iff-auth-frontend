import { fetchClient } from '../client';

export interface ForgotPasswordBody {
  email: string;
}

export const submitForgotPassword = async (body: ForgotPasswordBody) => {
  const response = await fetchClient.POST('/password/forgot', {
    body,
  });
  console.log('=>forgot-password.api response', response);

  return response;
};
