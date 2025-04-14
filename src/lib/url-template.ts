const getPlaceholder = (key: string) => `__${key}__`;

export const validateUrlTemplate = (
  urlTemplate: string,
  requiredKeys: readonly string[]
): boolean => {
  if (!URL.canParse(urlTemplate)) {
    return false;
  }

  for (const key of requiredKeys) {
    const placeholder = getPlaceholder(key);

    if (!urlTemplate.includes(placeholder)) {
      return false;
    }
  }

  return true;
};

export const interpolateUrlTemplate = <TKeys extends string>(
  urlTemplate: string,
  values: Record<TKeys, string>
): string => {
  if (!validateUrlTemplate(Object.keys(values))(urlTemplate)) {
    throw new Error(`Invalid URL template: ${urlTemplate}`);
  }

  for (const [key, value] of Object.entries(values) as [TKeys, string][]) {
    urlTemplate = urlTemplate.replace(getPlaceholder(key), value);
  }

  return urlTemplate;
};
