import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ThemeSwitch() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const setTheme = async (theme: "light" | "dark" | "system") => {
    setColorScheme(theme);
    await AsyncStorage.setItem("theme", theme);
  };

  return (
    <View className="flex flex-row gap-2">
      <Button
        variant={colorScheme === "light" ? "default" : "secondary"}
        onPress={() => setTheme("light")}
      >
        <Text>Light</Text>
      </Button>
      <Button
        variant={colorScheme === "dark" ? "default" : "secondary"}
        onPress={() => setTheme("dark")}
      >
        <Text>Dark</Text>
      </Button>
      <Button
        variant={colorScheme === "system" ? "default" : "secondary"}
        onPress={() => setTheme("system")}
      >
        <Text>System</Text>
      </Button>
    </View>
  );
}
