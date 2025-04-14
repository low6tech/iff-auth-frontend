import { interpolateUrlTemplate, validateUrlTemplate } from './url-template';

const CALLBACK_URL_TEMPLATE_SEARCH_KEY = 'callbackUrl' as const;

export const SIGNIN_CALLBACK_URL_TEMPLATE_TOKEN_KEY = 'token' as const;

export const getSearchCallbackUrlTemplate = (
  search: Record<string, unknown>
): string | undefined => {
  const callbackUrlTemplate = search[CALLBACK_URL_TEMPLATE_SEARCH_KEY];

  if (!isValidCallbackUrl(callbackUrlTemplate)) {
    return undefined;
  }

  return callbackUrlTemplate;
};

export function isValidCallbackUrl(
  callbackUrl: unknown
): callbackUrl is string {
  if (typeof callbackUrl !== 'string') {
    return false;
  }

  return validateUrlTemplate(callbackUrl, [
    SIGNIN_CALLBACK_URL_TEMPLATE_TOKEN_KEY,
  ]);
}

export const interpolateCallbackUrl = (
  callbackUrlTemplate: string,
  token: string
) => {
  return interpolateUrlTemplate(callbackUrlTemplate, {
    [SIGNIN_CALLBACK_URL_TEMPLATE_TOKEN_KEY]: token,
  });
};
