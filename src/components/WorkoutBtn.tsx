import { useWorkoutStore } from "@/store/workoutStore";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { router } from "expo-router";

// src/components/WorkoutButton.tsx
export function WorkoutButton() {
  const { isWorkoutActive, startNewWorkout } = useWorkoutStore();

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
      <Text>{isWorkoutActive ? "Resume Workout" : "Start Workout"}</Text>
    </Button>
  );
}
