import { workoutLog } from "@/db/types";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportWorkoutToCSV = async (workout: workoutLog) => {
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins}:${secs}`;
  };

  let csvContent = `Workout: ${workout.name}\n`;
  csvContent += `Date: ${formatDate(new Date(workout.created_at))}\n`;
  csvContent += `Duration: ${formatTime(workout.duration)}\n\n`;
  csvContent += `Exercise,Set,Reps,Weight(kg)\n`;

  workout.exercises.forEach(exercise => {
    exercise.sets.forEach((set, index) => {
      csvContent += `${exercise.exercise_name},${index + 1},${set.reps},${set.weight}\n`;
    });
  });

  const fileName = `workout_${workout.name}_${Date.now()}.csv`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  try {
    await FileSystem.writeAsStringAsync(filePath, csvContent);
    await Sharing.shareAsync(filePath, {
      mimeType: "text/csv",
      dialogTitle: "Export Workout Log",
    });
    await FileSystem.deleteAsync(filePath);
  } catch (error) {
    console.error("Error exporting workout:", error);
    throw error;
  }
};
