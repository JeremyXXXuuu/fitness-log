import React, { useRef, useEffect } from "react";
import { View, Animated, Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text } from "../../ui/text";
import { Set } from "@/db/types";
import { useKeyboard } from "@/components/ui/keyboardProvider";
import CustomKeyboardInput from "@/components/ui/keyboardInput";
import { useWorkoutStore } from "@/store/workoutStore";

interface Props {
  exerciseId: string;
  set: Set;
}

export default function SetComponent({ exerciseId, set }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { deleteInput } = useKeyboard();
  const { updateSet, deleteSet } = useWorkoutStore();

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
    outputRange: ["rgb(229, 231, 235)", "rgb(34, 197, 94)"],
  });

  const handleDelete = () => {
    console.log("delete set", set);
    deleteInput(set.id + "weight");
    deleteInput(set.id + "Reps");
    deleteSet(exerciseId, set.id);
  };

  // Render right swipe actions
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    return (
      <Pressable
        onPress={handleDelete}
        className="w-20 bg-red-500 justify-center items-center"
      >
        <Animated.Text
          className="text-white font-bold text-base"
          style={{ transform: [{ scale }] }}
        >
          Delete
        </Animated.Text>
      </Pressable>
    );
  };

  // Handle submit for custom keyboard
  const handleSubmitWeight = (text: string) => {
    console.log("weight", text);
    updateSet(exerciseId, { ...set, weight: parseFloat(text) || 0 });
  };

  const handleSubmitReps = (text: string) => {
    console.log("reps", text);
    updateSet(exerciseId, { ...set, reps: parseInt(text) || 0 });
  };

  return (
    // swipeable not working when swipe on set number input
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
    >
      <View className="flex flex-row items-center justify-between bg-background py-1">
        <Text>{set.setNumber}</Text>

        {/* Previous Weight */}
        {set.previousWeight ? (
          <Text>Previous: {set.previousWeight}kg</Text>
        ) : (
          <Text> - </Text>
        )}
        <View className="flex flex-row items-center justify-between gap-3">
          {/* Input for Weight */}
          <CustomKeyboardInput
            id={set.id + "weight"}
            className="w-20"
            onSubmit={handleSubmitWeight}
          />

          {/* Input for Reps */}
          <CustomKeyboardInput
            id={set.id + "Reps"}
            className="w-20"
            onSubmit={handleSubmitReps}
          />

          {/* Toggle Done Button */}
          <Pressable
            onPress={() =>
              updateSet(exerciseId, { ...set, isDone: !set.isDone })
            }
            className="h-10 w-10 rounded-full justify-center items-center"
          >
            <Animated.View
              style={{ backgroundColor }}
              className="h-10 w-10 rounded-full justify-center items-center"
            >
              <Text>{set.isDone ? "✓" : ""}</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}
