import React from "react";
import { View, Button } from "react-native";
import { Exercise, Set } from "../../../types/fitness";
import SetComponent from "./SetComponent";
import { Text } from "../../ui/text";
import { Input } from "../../ui/input";

interface Props {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
}

export default function ExerciseComponent({ exercise, onUpdate }: Props) {
  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      setNumber: exercise.sets.length + 1,
      weight: 0,
      previousWeight: 0,
      reps: 0,
      isDone: false,
    };
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet],
    });
  };

  return (
    <View className="p-4 bg-background">
      <Input
        value={exercise.name}
        placeholder="Exercise name"
        onChangeText={text => onUpdate({ ...exercise, name: text })}
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
          set={set}
          onDelete={() => {
            onUpdate({
              ...exercise,
              sets: exercise.sets.filter(s => s.id !== set.id),
            });
          }}
          onUpdate={updatedSet => {
            onUpdate({
              ...exercise,
              sets: exercise.sets.map(s =>
                s.id === updatedSet.id ? updatedSet : s,
              ),
            });
          }}
        />
      ))}

      <Button
        title="Add Set"
        onPress={addSet}
      />
    </View>
  );
}
