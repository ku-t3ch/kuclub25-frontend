export const combine = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

export const getValueForTheme = (
  resolvedTheme: 'light' | 'dark',
  darkValue: string,
  lightValue: string
): string => {
  return resolvedTheme === "dark" ? darkValue : lightValue;
};