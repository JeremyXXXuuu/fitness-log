import React from "react";
import { View, Button } from "react-native";
import { workoutLogExercise } from "@/db/types";
import { useWorkoutStore } from "@/store/workoutStore";
import SetComponent from "./SetComponent";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";

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
      <View className="mt-4">
        <View className="flex flex-row items-center justify-between py-2 px-4 bg-background">
          <Text className="w-8">Set</Text>
          <Text className="w-16 text-base">Previous</Text>
          <View className="flex flex-row items-center justify-between w-3/5">
            <Text className="w-14 text-center">Weight</Text>
            <Text className="w-12 text-center">Reps</Text>
            <Text className="w-8 text-center">RPE</Text>
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

        <View className="px-2 mt-2">
          <Button
            title="Add Set"
            onPress={() => addSet(exercise.id)}
          />
        </View>
      </View>
    </View>
  );
}
