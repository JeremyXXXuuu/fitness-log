import React, { useEffect } from "react";
import { ScrollView, Text, Button } from "react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import ExerciseComponent from "./ExerciseComponent";

export default function WorkoutLog() {
  const { currentWorkout, startNewWorkout, addExercise } = useWorkoutStore();
  const hasHydrated = useWorkoutStore(state => state._hasHydrated);

  useEffect(() => {
    if (!currentWorkout) {
      startNewWorkout();
    }
  }, [currentWorkout, startNewWorkout]);

  if (!hasHydrated) {
    console.log("Loading...");
    return <p>Loading...</p>;
  }
  if (!currentWorkout) return null;

  return (
    <ScrollView className="h-full w-full">
      <Text>{currentWorkout.name}</Text>
      <Text>{new Date(currentWorkout.date).toLocaleString()}</Text>

      {currentWorkout.exercises.map(exercise => (
        <ExerciseComponent
          key={exercise.id}
          exercise={exercise}
        />
      ))}

      <Button
        title="Add Exercise"
        onPress={addExercise}
      />
    </ScrollView>
  );
}
