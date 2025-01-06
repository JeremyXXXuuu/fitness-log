import {
  View,
  Pressable,
  Animated,
  useColorScheme as useNativeColorScheme,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState, useMemo } from "react";
import { useHaptic } from "@/lib/useHaptic";

export function ThemeSwitch() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemColorScheme = useNativeColorScheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("system");
  const [containerWidth, setContainerWidth] = useState(0);
  const triggerHaptic = useHaptic("selection");

  useEffect(() => {
    // 读取保存的主题设置
    AsyncStorage.getItem("theme").then(savedTheme => {
      if (savedTheme) {
        setSelectedTheme(savedTheme as "light" | "dark" | "system");
      }
    });
  }, []);

  useEffect(() => {
    if (selectedTheme === "system" && systemColorScheme) {
      setColorScheme(systemColorScheme);
    } else if (selectedTheme !== "system") {
      setColorScheme(selectedTheme);
    }
  }, [selectedTheme, systemColorScheme]);

  const setTheme = async (theme: "light" | "dark" | "system") => {
    triggerHaptic?.();
    setSelectedTheme(theme);
    await AsyncStorage.setItem("theme", theme);
  };

  const slidePosition = useMemo(() => {
    if (containerWidth === 0) return 0;
    const sectionWidth = containerWidth / 3;
    const position =
      selectedTheme === "light" ? 0 : selectedTheme === "dark" ? 1 : 2;
    return position * sectionWidth;
  }, [containerWidth, selectedTheme]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: slidePosition,
      useNativeDriver: true,
    }).start();
  }, [slidePosition]);

  return (
    <View
      className="bg-secondary rounded-lg p-1 flex-row relative w-8/12"
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <Animated.View
        className="absolute bg-primary rounded-md h-10"
        style={{
          width: containerWidth / 3,
          transform: [
            {
              translateX: slideAnim,
            },
          ],
        }}
      />
      {[
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "System", value: "system" },
      ].map(option => (
        <Pressable
          key={option.value}
          className="flex-1 h-8 items-center justify-center"
          onPress={() => setTheme(option.value as "light" | "dark" | "system")}
        >
          <Text
            className={
              selectedTheme === option.value
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
