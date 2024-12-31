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

export interface workoutLogExercise {
  id: string;
  sets: Set[];
  notes: string;
  weight_unit: string;
}

export interface Set {
  id: string;
  weight: number;
  reps: number;
  rpe: number;
  done: boolean;
  is_warmup: boolean;
  rest_time: number;
}
