import React, { useRef, useEffect } from "react";
import { View, Animated, Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text } from "@/components/ui/text";
import { Set } from "@/db/types";
import { useKeyboard } from "@/components/ui/keyboardProvider";
import CustomKeyboardInput from "@/components/ui/keyboardInput";
import { useWorkoutStore } from "@/store/workoutStore";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

interface Props {
  exerciseId: string;
  set: Set;
}

export default function SetComponent({ exerciseId, set }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { deleteInput, checkSetIsComplete } = useKeyboard();
  const { updateSetById, deleteSet } = useWorkoutStore();
  const { isDarkColorScheme } = useColorScheme();
  const bgColor = isDarkColorScheme
    ? NAV_THEME.dark.background
    : NAV_THEME.light.background;

  // Update the animated color when `set.isDone` changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: set.isDone ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, set.isDone]);

  // Interpolated background color based on `isDone`
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      bgColor,
      isDarkColorScheme ? "rgb(22, 101, 52)" : "rgb(220, 252, 231)", // dark green in dark mode, light green in light mode
    ],
  });

  const checkmarkBgColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "rgb(229, 231, 235)",
      isDarkColorScheme ? "rgb(34, 197, 94)" : "rgb(34, 197, 94)",
    ],
  });

  const handleDelete = () => {
    deleteInput(set.id + "weight");
    deleteInput(set.id + "Reps");
    deleteSet(exerciseId, set.id);
  };

  const handlePressDone = () => {
    if (checkSetIsComplete(set.id)) {
      updateSetById(exerciseId, { id: set.id, isDone: !set.isDone });
    }
  };

  // Render right swipe actions
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View
        style={{ transform: [{ translateX }] }}
        className="flex-row"
      >
        <Pressable
          onPress={handleDelete}
          className="w-20 bg-red-500 justify-center items-center rounded-xl my-0.5"
        >
          <Text className="text-white font-bold text-base">Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    // swipeable not working when swipe on set number input
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={{ paddingHorizontal: 8 }}
    >
      <Animated.View
        className="flex flex-row items-center justify-between py-2 my-0.5 px-4 rounded-xl"
        style={{ backgroundColor }}
      >
        <Text className="w-10">{set.setNumber}</Text>

        {/* Previous Weight */}
        <Text className="w-14">
          {set.previousWeight ? `${set.previousWeight}kg` : "-"}
        </Text>

        <View className="flex flex-row items-center justify-between w-3/5">
          {/* Input for Weight */}
          <CustomKeyboardInput
            id={`${exerciseId}-${set.id}-weight`}
            value={set.weight}
            className="w-14"
          />

          {/* Input for Reps */}
          <CustomKeyboardInput
            id={`${exerciseId}-${set.id}-reps`}
            value={set.reps}
            className="w-12"
          />

          {/* Input for RPE */}
          <CustomKeyboardInput
            id={`${exerciseId}-${set.id}-rpe`}
            value={set.rpe}
            keyboardType="rpe"
            className="w-8"
          />

          {/* Toggle Done Button */}
          <Pressable
            onPress={checkSetIsComplete(set.id) ? handlePressDone : undefined}
            className="h-10 w-10 rounded-full justify-center items-center"
            style={{ opacity: checkSetIsComplete(set.id) ? 1 : 0.5 }}
          >
            <Animated.View
              style={{ backgroundColor: checkmarkBgColor }}
              className="h-10 w-10 rounded-full justify-center items-center"
            >
              <Text>{set.isDone ? "✓" : ""}</Text>
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>
    </Swipeable>
  );
}
