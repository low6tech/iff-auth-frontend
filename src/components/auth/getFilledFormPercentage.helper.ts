// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFilledFormPercentage = (values: Record<string, any>) => {
  const totalFields = Object.keys(values).length;
  return (
    (Object.values(values).filter((value) => !!value).length /
      totalFields) *
    100
  );
};
