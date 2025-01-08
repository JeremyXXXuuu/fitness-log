import { workoutLog } from "@/db/types";
import { Alert, Share } from "react-native";

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatWorkoutToJSON = (workout: workoutLog) => {
  if (!workout) return "";
  const workoutData = {
    name: workout.name,
    date: new Date(workout.created_at).toISOString(),
    duration: formatTime(workout.duration),
    exercises: workout.exercises.map(exercise => ({
      name: exercise.exercise_name,
      exerciseUUId: exercise.exercise_id,
      sets: exercise.sets.map((set, index) => ({
        setNumber: index + 1,
        weight: set.weight,
        reps: set.reps,
        rpe: set.rpe,
      })),
    })),
  };

  return JSON.stringify(workoutData, null, 2);
};

export const handleExport = async (workout: workoutLog) => {
  try {
    const json = formatWorkoutToJSON(workout);
    const fileName = `workout_${workout.name}_${new Date().toISOString().split("T")[0]}.json`;
    await Share.share({
      message: json,
      title: fileName,
    });
  } catch (error) {
    Alert.alert("Export Failed", "Failed to export workout data.");
  }
};
