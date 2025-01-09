import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
    updateExercise,
    updateWorkoutName,
    updateWorkoutNotes,
    finishWorkout,
    startTime,
  } = useWorkoutStore();
  const hasHydrated = useWorkoutStore(state => state._hasHydrated);
  const [elapsedTime, setElapsedTime] = useState(() =>
    startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
  );
  const [showSearch, setShowSearch] = useState(false);
  const [updateWorkoutId, setUpdateWorkoutId] = useState("");

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
    if (updateWorkoutId) {
      // Update existing exercise
      const oldExercise = currentWorkout?.exercises.find(
        ex => ex.id === updateWorkoutId,
      );
      if (!oldExercise) return;
      updateExercise({
        ...oldExercise,
        id: updateWorkoutId,
        exercise_name: exercise.name,
        exercise_id: exercise.uuid,
      });
      setUpdateWorkoutId("");
    } else {
      addExercise(exercise);
    }
    setShowSearch(false);
  };

  const replaceExercise = (replace_id: string) => {
    setShowSearch(true);
    setUpdateWorkoutId(replace_id);
  };

  const DismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!hasHydrated) {
    console.log("Loading...");
    return <p>Loading...</p>;
  }
  if (!currentWorkout) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="w-full"
    >
      {showSearch ? (
        <ExerciseSearch
          visible={showSearch}
          onSelect={handleSelectExercise}
          onClose={() => setShowSearch(false)}
        />
      ) : (
        <View className="h-full w-full px-4">
          <TouchableWithoutFeedback
            onPress={() => {
              DismissKeyboard();
            }}
          >
            <View>
              <View className="flex-row justify-between items-center">
                <Button
                  size="sm"
                  variant="link"
                  onPress={handleClose}
                >
                  <Text>Close</Text>
                </Button>

                <Button
                  size="sm"
                  variant="link"
                  onPress={handleFinishWorkout}
                >
                  <Text>Finish</Text>
                </Button>
              </View>
              <View className="flex-row justify-between items-center">
                <Input
                  value={currentWorkout.name}
                  onChangeText={updateWorkoutName}
                  placeholder="Workout Name"
                  className="border-0"
                />

                <Text className="text-center text-xl">
                  {formatTime(elapsedTime)}
                </Text>
              </View>

              <Input
                value={currentWorkout.notes || ""}
                onChangeText={updateWorkoutNotes}
                placeholder="Workout Notes"
                className="border-0"
              />
            </View>
            {/* workout notes here */}
          </TouchableWithoutFeedback>
          <FlatList
            className="flex-1 px-2"
            data={currentWorkout.exercises}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  DismissKeyboard();
                }}
              >
                <ExerciseComponent
                  key={item.id}
                  exercise={item}
                  replaceExercise={replaceExercise}
                />
              </TouchableWithoutFeedback>
            )}
            keyExtractor={item => item.id}
            ListFooterComponent={() => (
              <Button
                className="mb-10"
                variant="secondary"
                onPress={handleAddExercise}
              >
                <Text>ADD EXERCISE</Text>
              </Button>
            )}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
