import React from "react";
import { View, Button } from "react-native";
import { workoutLogExercise } from "@/db/types";
import { useWorkoutStore } from "@/store/workoutStore";
import SetComponent from "./SetComponent";
import { Text } from "../../ui/text";
import { Input } from "../../ui/input";

interface Props {
  exercise: workoutLogExercise;
}

export default function ExerciseComponent({ exercise }: Props) {
  const { addSet, updateExercise } = useWorkoutStore();

  return (
    <View className="p-4 bg-background">
      <Input
        value={exercise.exercise_name}
        placeholder="Exercise name"
        onChangeText={text =>
          updateExercise({ ...exercise, exercise_name: text })
        }
      />
      <View className="flex flex-row items-center justify-between py-2 bg-background">
        <Text>Set</Text>
        <Text>Previous</Text>
        <View className="flex flex-row items-center justify-between gap-5">
          <Text className="w-20 text-center">Weight</Text>
          <Text className="w-20 text-center">Reps</Text>
          <Text className="w-10 text-center">Done</Text>
        </View>
      </View>
      {exercise.sets.map(set => (
        <SetComponent
          key={set.id}
          exerciseId={exercise.id}
          set={set}
        />
      ))}

      <Button
        title="Add Set"
        onPress={() => addSet(exercise.id)}
      />
    </View>
  );
}
