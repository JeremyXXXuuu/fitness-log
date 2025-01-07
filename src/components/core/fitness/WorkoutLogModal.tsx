import React, { useState } from "react";
import { Modal, ScrollView, View, Alert } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { workoutLog } from "@/db/types";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { WorkoutLogService } from "@/db/workout_log";

interface WorkoutLogModalProps {
  workout: workoutLog | undefined;
  visible: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export function WorkoutLogModal({
  workout,
  visible,
  onClose,
  onDelete,
}: WorkoutLogModalProps) {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  if (!workout) return null;

  const handleDelete = async () => {
    if (!workout) return;
    await WorkoutLogService.deleteWorkoutLog(workout.id);
    onDelete?.();
    onClose();
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      style={{ backgroundColor: theme.background }}
    >
      <ScrollView
        className="flex-1 pt-12"
        style={{ backgroundColor: theme.background }}
      >
        <View className="flex-row justify-between items-center p-4">
          <Button
            onPress={onClose}
            className="rounded-full w-20"
            variant="default"
          >
            <Text>close</Text>
          </Button>
          <Text className="text-xl font-bold">{workout.name}</Text>
          <Button
            onPress={showDeleteConfirmation}
            variant="destructive"
            className="rounded-full w-20"
          >
            <Text>Delete</Text>
          </Button>
        </View>

        <Text className="text-center">
          Duration: {formatTime(workout.duration)}
        </Text>

        {workout.exercises.map(exercise => (
          <View
            key={exercise.id}
            className="p-4 m-2 rounded"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: 1,
            }}
          >
            <Text className="text-lg font-semibold">
              {exercise.exercise_name}
            </Text>
            {exercise.sets.map((set, index) => (
              <Text
                key={index}
                className="mt-1"
              >
                Set {index + 1}: {set.reps} reps × {set.weight}kg
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </Modal>
  );
}
