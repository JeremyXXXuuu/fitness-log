import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutLog, workoutLogExercise, Set } from "@/db/types";
import { WorkoutLogService } from "@/db/workout_log";
import { ExerciseSelect } from "@/db/exercises";

interface WorkoutState {
  currentWorkout: workoutLog | null;
  isWorkoutActive: boolean;
  startTime: number | null;
  startNewWorkout: () => void;
  updateWorkoutName: (name: string) => void;
  updateWorkoutNotes: (notes: string) => void;
  addExercise: (exercise: ExerciseSelect) => void;
  updateExercise: (exercise: workoutLogExercise) => void;
  deleteExercise: (id: string) => void;
  addSet: (exerciseId: string, newSet?: Set) => void;
  updateSet: (exerciseId: string, set: Set) => void;
  updateSetById: (exerciseId: string, updates: Partial<Set>) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  finishWorkout: () => Promise<void>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      isWorkoutActive: false,
      startTime: null,
      startNewWorkout: () =>
        set({
          currentWorkout: {
            id: Date.now().toString(),
            name: "New Workout",
            exercises: [],
            notes: "",
            user_id: "1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            duration: 0,
            is_synced: 0,
            calendar_date: new Date().toISOString().split("T")[0],
          },
          isWorkoutActive: true,
          startTime: Date.now(),
        }),

      updateWorkoutName: (name: string) => {
        const workout = get().currentWorkout;
        if (!workout) return;
        set({
          currentWorkout: {
            ...workout,
            name,
          },
        });
      },

      updateWorkoutNotes: (notes: string) => {
        const workout = get().currentWorkout;
        if (!workout) return;
        set({
          currentWorkout: {
            ...workout,
            notes,
          },
        });
      },

      addExercise: (exercise: ExerciseSelect) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const newExercise: workoutLogExercise = {
          id: Date.now().toString(),
          exercise_name: exercise.name,
          exercise_id: exercise.uuid,
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

      addSet: (exerciseId: string, newSet?: Set) => {
        const workout = get().currentWorkout;
        if (!workout) return;

        const exercise = workout.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;

        const _newSet: Set = newSet || {
          id: Date.now().toString(),
          setNumber: exercise.sets.length + 1,
          weight: 0,
          previousWeight: 0,
          reps: 0,
          rpe: 0,
          isDone: false,
        };

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exerciseId ? { ...e, sets: [...e.sets, _newSet] } : e,
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
                    sets: e.sets.map(s => {
                      return s.id === updatedSet.id ? updatedSet : s;
                    }),
                  }
                : e,
            ),
          },
        });
      },

      updateSetById: (exerciseId: string, updates: Partial<Set>) => {
        console.log("updateSetById", exerciseId, updates.weight);
        const workout = get().currentWorkout;
        if (!workout) return;

        const exercise = workout.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;

        // Validate numeric fields
        if ("weight" in updates) {
          updates.weight = Number.isFinite(updates.weight) ? updates.weight : 0;
        }
        if ("reps" in updates) {
          updates.reps = Number.isFinite(updates.reps) ? updates.reps : 0;
        }
        if ("rpe" in updates) {
          updates.rpe = Number.isFinite(updates.rpe) ? updates.rpe : 0;
        }

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exerciseId
                ? {
                    ...e,
                    sets: e.sets.map(s =>
                      s.id === updates.id ? { ...s, ...updates } : s,
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

        const exercise = workout.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;

        // Filter out the deleted set
        const updatedSets = exercise.sets.filter(s => s.id !== setId);

        // Renumber the remaining sets
        const renumberedSets = updatedSets.map((s, index) => ({
          ...s,
          setNumber: index + 1,
        }));

        set({
          currentWorkout: {
            ...workout,
            exercises: workout.exercises.map(e =>
              e.id === exerciseId ? { ...e, sets: renumberedSets } : e,
            ),
          },
        });
      },

      finishWorkout: async () => {
        console.log("Finishing workout...");
        const workout = get().currentWorkout;
        if (!workout) return;
        const startTime = get().startTime;
        if (!startTime) return;

        const finalWorkout = {
          ...workout,
          duration: Math.floor((Date.now() - startTime) / 1000),
          updated_at: new Date().toISOString(),
        };

        try {
          await WorkoutLogService.createWorkoutLog(finalWorkout);
          set({
            currentWorkout: null,
            isWorkoutActive: false,
            startTime: null,
          });
          console.log("Workout saved successfully!");
        } catch (error) {
          console.error("Failed to save workout:", error);
        }
      },

      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: "workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
