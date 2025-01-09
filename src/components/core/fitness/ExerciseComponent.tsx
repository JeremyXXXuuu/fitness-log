import React from "react";
import { View } from "react-native";
import { workoutLogExercise } from "@/db/types";
import { useWorkoutStore } from "@/store/workoutStore";
import SetComponent from "./SetComponent";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ExerciseDropDownMenu } from "@/components/ExerciseDropDownMenu";
import ExerciseDetail from "@/components/core/fitness/ExerciseDetail";

interface Props {
  exercise: workoutLogExercise;
  replaceExercise: (replace_id: string) => void;
}

export default function ExerciseComponent({
  exercise,
  replaceExercise,
}: Props) {
  const { addSet, deleteExercise } = useWorkoutStore();
  const [showExerciseDetail, setShowExerciseDetail] = React.useState(false);

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

  return (
    <View style={{ flex: 1 }}>
      <View className="bg-background m-4">
        <View className="flex flex-row items-center justify-between">
          <Button
            size="sm"
            className="w-1/2"
            variant="link"
            onPress={() => {
              // show exercise detail
              setShowExerciseDetail(true);
            }}
          >
            <Text>{exercise.exercise_name}</Text>
          </Button>
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

      {showExerciseDetail && (
        <ExerciseDetail
          exercise_id={exercise.exercise_id}
          visible={showExerciseDetail}
          onBack={() => setShowExerciseDetail(false)}
        />
      )}
    </View>
  );
}
