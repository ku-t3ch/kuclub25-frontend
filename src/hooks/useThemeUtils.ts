import { useTheme } from "../contexts/ThemeContext";
import { combine, getValueForTheme } from "../utils/theme";

export const useThemeUtils = () => {
  const { resolvedTheme } = useTheme();

  const getThemeValue = (darkValue: string, lightValue: string): string => {
    return getValueForTheme(resolvedTheme, darkValue, lightValue);
  };

  return {
    combine,
    getValueForTheme: getThemeValue,
    resolvedTheme,
  };
};