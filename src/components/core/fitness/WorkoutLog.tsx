import React, { useEffect, useState } from "react";
import { ScrollView, Button, View } from "react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import ExerciseComponent from "./ExerciseComponent";
import { router } from "expo-router";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function WorkoutLog() {
  const {
    currentWorkout,
    addExercise,
    updateWorkoutName,
    finishWorkout,
    startTime,
  } = useWorkoutStore();
  const hasHydrated = useWorkoutStore(state => state._hasHydrated);
  const [elapsedTime, setElapsedTime] = useState(() =>
    startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
  );

  // Update timer display every second
  useEffect(() => {
    if (!startTime) return;

    // Set initial time immediately
    setElapsedTime(Math.floor((Date.now() - startTime) / 1000));

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    router.back();
  };

  const handleFinishWorkout = async () => {
    await finishWorkout();
    router.back();
  };

  if (!hasHydrated) {
    console.log("Loading...");
    return <p>Loading...</p>;
  }
  if (!currentWorkout) return null;

  return (
    <ScrollView className="h-full w-full">
      <View className="flex-row justify-between items-center p-4">
        <Button
          onPress={handleClose}
          title="Close"
        />
        <Button
          onPress={handleFinishWorkout}
          title="Finish Workout"
        />
      </View>

      <Input
        value={currentWorkout.name}
        onChangeText={updateWorkoutName}
        placeholder="Workout Name"
        className="p-2 m-2 border border-gray-300 rounded"
      />

      <Text className="text-center text-xl">{formatTime(elapsedTime)}</Text>

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
