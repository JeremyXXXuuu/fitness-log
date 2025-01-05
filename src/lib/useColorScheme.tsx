import { useColorScheme as useSystemColorScheme } from "react-native";
import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  const isDarkColorScheme =
    colorScheme === "dark" ||
    (colorScheme === "system" && systemColorScheme === "dark");

  const setTheme = (theme: "light" | "dark" | "system") => {
    setColorScheme(theme);
  };

  return {
    colorScheme: colorScheme ?? "system",
    isDarkColorScheme,
    setColorScheme: setTheme,
    toggleColorScheme,
  };
}
