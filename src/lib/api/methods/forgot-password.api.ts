export interface ForgotPasswordBody {
  email: string;
}

export const submitForgotPassword = async (body: ForgotPasswordBody) => {
  // TODO make API call
  return Promise.resolve({ ...body, success: true });
};
