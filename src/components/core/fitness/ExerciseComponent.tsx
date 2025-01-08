import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutLogExercise } from "@/db/types";
import { useWorkoutStore } from "@/store/workoutStore";
import SetComponent from "./SetComponent";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExerciseDropDownMenu } from "@/components/ExerciseDropDownMenu";
import ExerciseSearch from "./ExerciseSearch";
import { ExerciseSelect } from "@/db/exercises";

interface Props {
  exercise: workoutLogExercise;
}

export default function ExerciseComponent({ exercise }: Props) {
  const [showSearch, setShowSearch] = useState(false);
  const { addSet, updateExercise, deleteExercise } = useWorkoutStore();

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSetValues = lastSet
      ? {
          id: Date.now().toString(),
          setNumber: exercise.sets.length + 1,
          previousWeight: 0,
          isDone: false,
          weight: lastSet.weight,
          reps: lastSet.reps,
          rpe: lastSet.rpe,
        }
      : undefined;
    addSet(exercise.id, newSetValues);
  };

  const replaceExercise = () => {
    console.log("Replace exercise clicked");
    setShowSearch(true);
  };

  const handleExerciseSelect = (selectedExercise: ExerciseSelect) => {
    updateExercise({
      ...exercise,
      exercise_name: selectedExercise.name,
      exercise_id: selectedExercise.uuid,
    });
    setShowSearch(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {showSearch ? (
        <SafeAreaView style={{ flex: 1 }}>
          <ExerciseSearch
            onSelect={handleExerciseSelect}
            onClose={() => setShowSearch(false)}
          />
        </SafeAreaView>
      ) : (
        <View className="bg-background m-4">
          <View className="flex flex-row items-center justify-between">
            <Input
              className="w-1/2"
              value={exercise.exercise_name}
              placeholder="Exercise name"
              onChangeText={text =>
                updateExercise({ ...exercise, exercise_name: text })
              }
            />
            <ExerciseDropDownMenu
              exerciseId={exercise.id}
              onDelete={deleteExercise}
              onReplace={replaceExercise}
            />
          </View>
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
                size="sm"
                variant="outline"
                onPress={handleAddSet}
              >
                <Text>ADD SET</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
