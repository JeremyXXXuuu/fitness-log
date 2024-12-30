import React, { useRef, useEffect } from "react";
import { View, Animated, Pressable, StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text } from "../../ui/text";
import { Input, NumberInput } from "../../ui/input";
import { Set } from "../../../types/fitness";

interface Props {
  set: Set;
  onUpdate: (set: Set) => void;
  onDelete: () => void;
}

export default function SetComponent({ set, onUpdate, onDelete }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Update the animated color when `set.isDone` changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: set.isDone ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [set.isDone]);

  // Interpolated background color based on `isDone`
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(229, 231, 235)", "rgb(34, 197, 94)"],
  });

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
        onPress={onDelete}
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
          <NumberInput
            className="w-20 h-10 border border-gray-300 text-center mr-2"
            value={set.weight.toString()}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            onChangeText={text =>
              onUpdate({ ...set, weight: parseFloat(text) || 0 })
            }
          />

          {/* Input for Reps */}
          <NumberInput
            className="w-20 h-10 border border-gray-300 text-center mr-2"
            value={set.reps.toString()}
            placeholder="Reps"
            keyboardType="numeric"
            onChangeText={text =>
              onUpdate({ ...set, reps: parseInt(text) || 0 })
            }
          />

          {/* Toggle Done Button */}
          <Pressable
            onPress={() => onUpdate({ ...set, isDone: !set.isDone })}
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
