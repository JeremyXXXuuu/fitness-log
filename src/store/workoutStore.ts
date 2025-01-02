import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutLog, workoutLogExercise, Set } from "@/db/types";

interface WorkoutState {
  currentWorkout: workoutLog | null;
  startNewWorkout: () => void;
  addExercise: () => void;
  updateExercise: (exercise: workoutLogExercise) => void;
  deleteExercise: (id: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, set: Set) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentWorkout: null,

      startNewWorkout: () =>
        set({
          currentWorkout: {
            id: Date.now().toString(),
            name: "New Workout",
            date: new Date().toISOString(),
            exercises: [],
            user_id: "1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            duration: 0,
            is_synced: false,
          },
        }),

      addExercise: () => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const newExercise: workoutLogExercise = {
          id: Date.now().toString(),
          exercise_name: "",
          exercise_id: "",
          sets: [],
        };

        set({
          currentWorkout: {
            ...workout,
            exercises: [...workout.exercises, newExercise],
          },
        });
      },

      updateExercise: (exercise: workoutLogExercise) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exercise.id ? exercise : e,
            ),
          },
        });
      },

      deleteExercise: (id: string) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.filter(e => e.id !== id),
          },
        });
      },

      addSet: (exerciseId: string) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const exercise = workout.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;

        const newSet: Set = {
          id: Date.now().toString(),
          setNumber: exercise.sets.length + 1,
          weight: 0,
          previousWeight: 0,
          reps: 0,
          isDone: false,
        };

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e,
            ),
          },
        });
      },

      updateSet: (exerciseId: string, updatedSet: Set) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exerciseId
                ? {
                    ...e,
                    sets: e.sets.map(s =>
                      s.id === updatedSet.id ? updatedSet : s,
                    ),
                  }
                : e,
            ),
          },
        });
      },

      deleteSet: (exerciseId: string, setId: string) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exerciseId
                ? { ...e, sets: e.sets.filter(s => s.id !== setId) }
                : e,
            ),
          },
        });
      },
    }),
    {
      name: "workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
