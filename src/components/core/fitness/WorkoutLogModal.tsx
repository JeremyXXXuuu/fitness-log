import React from "react";
import { Modal, ScrollView, View, Alert, Share } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { workoutLog } from "@/db/types";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { WorkoutLogService } from "@/db/workout_log";
import { handleExport } from "@/lib/exportWorkoutLog";

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

  // const formatWorkoutToJSON = () => {
  //   if (!workout) return "";
  //   const workoutData = {
  //     name: workout.name,
  //     date: new Date(workout.created_at).toISOString(),
  //     duration: formatTime(workout.duration),
  //     exercises: workout.exercises.map(exercise => ({
  //       name: exercise.exercise_name,
  //       sets: exercise.sets.map((set, index) => ({
  //         setNumber: index + 1,
  //         weight: set.weight,
  //         reps: set.reps,
  //         rpe: set.rpe,
  //       })),
  //     })),
  //   };

  //   return JSON.stringify(workoutData, null, 2);
  // };

  // const handleExport = async () => {
  //   try {
  //     const json = formatWorkoutToJSON();
  //     const fileName = `workout_${workout.name}_${new Date().toISOString().split("T")[0]}.json`;
  //     await Share.share({
  //       message: json,
  //       title: fileName,
  //     });
  //   } catch (error) {
  //     Alert.alert("Export Failed", "Failed to export workout data.");
  //   }
  // };

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
            <Text>Close</Text>
          </Button>
          <Text className="text-xl font-bold">{workout.name}</Text>
          <View className="flex-row gap-2">
            <Button
              onPress={() => handleExport(workout)}
              variant="outline"
              className="rounded-full w-20"
            >
              <Text>Export</Text>
            </Button>
            <Button
              onPress={showDeleteConfirmation}
              variant="destructive"
              className="rounded-full w-20"
            >
              <Text>Delete</Text>
            </Button>
          </View>
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
