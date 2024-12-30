import React, { useState } from "react";
import { ScrollView, Text, Button, StyleSheet } from "react-native";
import { Workout, Exercise } from "../../../types/fitness";
import ExerciseComponent from "./ExerciseComponent";

export default function WorkoutLog() {
  const [workout, setWorkout] = useState<Workout>({
    id: "1",
    name: "Leg Workout",
    date: new Date(),
    exercises: [],
  });

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: [],
    };
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, newExercise],
    });
  };

  return (
    <ScrollView className="h-full w-full">
      <Text>{workout.name}</Text>
      <Text>{workout.date.toLocaleDateString()}</Text>

      {workout.exercises.map(exercise => (
        <ExerciseComponent
          key={exercise.id}
          exercise={exercise}
          onUpdate={updatedExercise => {
            setWorkout({
              ...workout,
              exercises: workout.exercises.map(e =>
                e.id === updatedExercise.id ? updatedExercise : e,
              ),
            });
          }}
        />
      ))}

      <Button
        title="Add Exercise"
        onPress={addExercise}
      />
    </ScrollView>
  );
}
