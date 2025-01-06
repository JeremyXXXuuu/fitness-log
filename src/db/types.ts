export type MacrosGoal = {
  fat: number;
  protein: number;
  carbs: number;
};

export enum ActivityLevel {
  Sedentary = "Sedentary",
  LightlyActive = "Lightly Active",
  ModeratelyActive = "Moderately Active",
  VeryActive = "Very Active",
  SuperActive = "Super Active",
}

export enum force {
  null = "null",
  push = "push",
  pull = "pull",
  static = "static",
}

export enum level {
  beginner = "beginner",
  intermediate = "intermediate",
  expert = "expert",
}

export enum mechanic {
  null = "null",
  compound = "compound",
  isolation = "isolation",
}

export enum equipment {
  null = "null",
  medicineBall = "medicine ball",
  dumbbell = "dumbbell",
  bodyOnly = "body only",
  bands = "bands",
  kettlebells = "kettlebells",
  foamRoll = "foam roll",
  cable = "cable",
  machine = "machine",
  barbell = "barbell",
  exerciseBall = "exercise ball",
  ezCurlBar = "e-z curl bar",
  other = "other",
}

export enum primaryMuscles {
  abdominals = "abdominals",
  abductors = "abductors",
  adductors = "adductors",
  biceps = "biceps",
  calves = "calves",
  chest = "chest",
  forearms = "forearms",
  glutes = "glutes",
  hamstrings = "hamstrings",
  lats = "lats",
  lowerBack = "lower back",
  middleBack = "middle back",
  neck = "neck",
  quadriceps = "quadriceps",
  shoulders = "shoulders",
  traps = "traps",
  triceps = "triceps",
}

export enum secondaryMuscles {
  abdominals = "abdominals",
  abductors = "abductors",
  adductors = "adductors",
  biceps = "biceps",
  calves = "calves",
  chest = "chest",
  forearms = "forearms",
  glutes = "glutes",
  hamstrings = "hamstrings",
  lats = "lats",
  lowerBack = "lower back",
  middleBack = "middle back",
  neck = "neck",
  quadriceps = "quadriceps",
  shoulders = "shoulders",
  traps = "traps",
  triceps = "triceps",
}

export enum category {
  powerlifting = "powerlifting",
  strength = "strength",
  stretching = "stretching",
  cardio = "cardio",
  olympicWeightlifting = "olympic weightlifting",
  strongman = "strongman",
  plyometrics = "plyometrics",
}

export interface workoutLog {
  id: string;
  name: string;
  date: string;
  exercises: workoutLogExercise[];
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  duration: number; // in seconds
  is_synced: boolean; // 0 = not synced, 1 = synced
}

export interface workoutLogExercise {
  id: string;
  sets: Set[];
  notes?: string;
  weight_unit?: string; // kg or lbs. Default is kg
  exercise_id: string;
  exercise_name: string;
}

export interface Set {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  isDone: boolean;
  is_warmup?: boolean; // true if this set is a warmup set
  rest_time?: number;
  previousWeight?: number;
}
