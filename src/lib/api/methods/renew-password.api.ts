import { fetchClient } from '../client';

interface RenewPasswordBody {
  newPassword: string;
  token: string;
}

export const submitRenewPassword = async (body: RenewPasswordBody) => {
  await fetchClient.POST('/password/reset', {
    body,
  });
};
