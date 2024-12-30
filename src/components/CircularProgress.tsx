import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

import { useColorScheme } from "@/lib/useColorScheme";
import { NAV_THEME } from "@/lib/constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress = ({
  name,
  goal,
  current,
}: {
  name: string;
  goal: number;
  current: number;
}) => {
  const { colorScheme } = useColorScheme();

  // Define colors based on color scheme
  const backgroundCircleColor = colorScheme === "dark" ? "#333333" : "#e0e0e0";
  const progressCircleColor =
    colorScheme === "dark" ? NAV_THEME.dark.primary : NAV_THEME.light.primary;

  const size = 88; // Diameter of the circle
  const strokeWidth = 10; // Thickness of the circle
  const radius = (size - strokeWidth) / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle

  const progress = Math.min(current / goal, 1); // Ensure progress does not exceed 1

  const animatedProgress = useSharedValue(0); // Shared value for animation

  // Animate progress on mount or when `current` changes
  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - animatedProgress.value * circumference,
  }));

  return (
    <View style={styles.container}>
      <Svg
        width={size}
        height={size}
      >
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundCircleColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressCircleColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      {/* Text Overlay */}
      <View
        className="text-xs"
        style={styles.textContainer}
      >
        <Text className="text-lg">{current}</Text>
        <Text className="text-sm">{name}</Text>
        {/* <Text className="text-xs">{goal} kcal</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
