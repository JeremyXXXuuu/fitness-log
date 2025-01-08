import React, { useEffect, useState } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import ExerciseComponent from "./ExerciseComponent";
import { router } from "expo-router";
import ExerciseSearch from "./ExerciseSearch";
import { ExerciseSelect } from "@/db/exercises";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [showSearch, setShowSearch] = useState(false);

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

  const handleAddExercise = () => {
    setShowSearch(true);
  };

  const handleSelectExercise = (exercise: ExerciseSelect) => {
    addExercise(exercise);
    setShowSearch(false);
  };

  if (!hasHydrated) {
    console.log("Loading...");
    return <p>Loading...</p>;
  }
  if (!currentWorkout) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full"
    >
      {showSearch ? (
        <ExerciseSearch
          onSelect={handleSelectExercise}
          onClose={() => setShowSearch(false)}
        />
      ) : (
        <View className="h-full w-full">
          <View className="flex-row justify-between items-center p-4">
            <Button
              size="sm"
              variant="link"
              onPress={handleClose}
            >
              <Text>close</Text>
            </Button>

            <Button
              size="sm"
              variant="link"
              onPress={handleFinishWorkout}
            >
              <Text>Finish</Text>
            </Button>
          </View>

          <Input
            value={currentWorkout.name}
            onChangeText={updateWorkoutName}
            placeholder="Workout Name"
            className="mx-2 border-0 native:text-xl"
          />

          <Text className="text-center text-xl">{formatTime(elapsedTime)}</Text>

          {/* workout notes here */}

          <Input
            value={currentWorkout.name}
            onChangeText={updateWorkoutName}
            placeholder="Workout Notes"
            className="mx-2 border-0"
          />

          <ScrollView className="flex-1 px-2">
            {currentWorkout.exercises.map(exercise => (
              <ExerciseComponent
                key={exercise.id}
                exercise={exercise}
              />
            ))}

            <Button
              className="mb-10"
              variant="secondary"
              onPress={handleAddExercise}
            >
              <Text>ADD EXERCISE</Text>
            </Button>
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
