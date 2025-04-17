interface RenewPasswordBody {
  newPassword: string;
  token: string;
}

export const submitRenewPassword = async (body: RenewPasswordBody) => {
  // TODO make API call
  return Promise.resolve({ ...body, success: true });
};
