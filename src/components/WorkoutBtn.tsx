import { useWorkoutStore } from "@/store/workoutStore";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export function WorkoutButton() {
  const { isWorkoutActive, startNewWorkout, currentWorkout } =
    useWorkoutStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && currentWorkout) {
      interval = setInterval(() => {
        const startTime = new Date(currentWorkout.created_at).getTime();
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, currentWorkout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePress = () => {
    if (!isWorkoutActive) {
      startNewWorkout();
    }
    router.push("/workout");
  };

  return (
    <Button
      onPress={handlePress}
      className="rounded-full"
    >
      {/* <Text>
        {isWorkoutActive && currentWorkout
          ? `${currentWorkout.name} - ${formatTime(elapsedTime)}`
          : "Start Workout"}
      </Text> */}
      {isWorkoutActive && currentWorkout ? (
        <View className="flex flex-col items-center">
          {/* <Text>{currentWorkout.name}</Text> */}
          <Text>{formatTime(elapsedTime)}</Text>
        </View>
      ) : (
        <Text>Start </Text>
      )}
    </Button>
  );
}
