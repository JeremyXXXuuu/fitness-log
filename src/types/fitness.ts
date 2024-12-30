export interface Set {
  id: string;
  setNumber: number;
  weight: number;
  previousWeight?: number;
  reps: number;
  isDone: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  duration?: number;
  Notes?: string;
}
