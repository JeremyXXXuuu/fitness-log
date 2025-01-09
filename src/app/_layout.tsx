import "@/styles/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Text } from "@/components/ui/text";

// db setup
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFocusEffect } from "expo-router";
import migrations from "drizzle/migrations";
import { getDatabase, getDrizzle } from "@/db/db";
import { useCallback, useEffect } from "react";
import { ExerciseService } from "@/db/exercises";

import { JsStack } from "@/lib/jsStack";
import { PortalHost } from "@rn-primitives/portal";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {},
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {},
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const { success, error } = useMigrations(getDrizzle(), migrations);
  useDrizzleStudio(getDatabase());
  useEffect(() => {
    if (!success) return;
  }, [success]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      async function prepareData() {
        await ExerciseService.fetchAndLoadExercises();
      }
      prepareData();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("This route is now unfocused.");
      };
    }, []),
  );

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", "system");
        setColorScheme("system");
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme as "light" | "dark" | "system";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  if (error) {
    console.error("Migration error:", error);
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <JsStack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <JsStack.Screen
          name="workout"
          options={{
            presentation: "modal",
            headerShown: false,
            cardStyle: {
              marginBottom: 0,
              marginHorizontal: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}
        />
      </JsStack>
      <PortalHost />
    </ThemeProvider>
  );
}
