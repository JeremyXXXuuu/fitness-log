import { getDrizzle } from "./db";
import { exercisesTable } from "./schema";
import { eq, sql } from "drizzle-orm";
import {
  force,
  level,
  mechanic,
  equipment,
  category,
  primaryMuscles,
} from "./types";

const EXERCISES_URL =
  "https://raw.githubusercontent.com/jeremyxxxuuu/exercise-db/main/dist/exercises.json";

// Example API response type
interface ApiExercise {
  id: string;
  name: string;
  force?: string;
  level: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[]; // Array in API
  secondaryMuscles: string[]; // Array in API
  instructions: string[]; // Array in API
  category: string;
  images: string[]; // Array in API
}

export type ExerciseInsert = typeof exercisesTable.$inferInsert;
export type ExerciseSelect = typeof exercisesTable.$inferSelect;

// Exercise related database operations
export class ExerciseService {
  static db = getDrizzle();

  static async getExerciseByName(name: string) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.name, name))
      .get();
  }

  static async getAllExercises() {
    return await ExerciseService.db.select().from(exercisesTable).all();
  }

  static async deleteAllExercises() {
    return await ExerciseService.db.delete(exercisesTable);
  }

  static async createUserCustomExercise(exercise: ExerciseInsert) {
    return await ExerciseService.db.insert(exercisesTable).values(exercise);
  }

  static async getExercisesByCategory(category: category) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.category, category))
      .all();
  }

  static async getExercisesByForce(force: force) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.force, force))
      .all();
  }

  static async getExercisesByLevel(level: level) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.level, level))
      .all();
  }

  static async getExercisesByMechanic(mechanic: mechanic) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.mechanic, mechanic))
      .all();
  }

  static async getExercisesByEquipment(equipment: equipment) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.equipment, equipment))
      .all();
  }

  static async getExercisesByPrimaryMuscle(muscle: primaryMuscles) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.primaryMuscles, JSON.stringify([muscle])))
      .all();
  }

  static async deleteExerciseById(id: string) {
    //only can delete user created exercises
    //check if exercise is user created
    const exercise = await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.id, id))
      .get();
    if (exercise && !exercise.isUserCreated) {
      throw new Error("Cannot delete system exercises.");
    }
    return await ExerciseService.db
      .delete(exercisesTable)
      .where(eq(exercisesTable.id, id))
      .all();
  }

  static async fetchAndLoadExercises() {
    console.log("Fetching exercises from server...");
    // Check if exercises are already loaded
    const existingExercises = await this.getAllExercises();
    if (existingExercises.length > 0) {
      console.log("Exercises already loaded.");
      return;
    }

    // Fetch exercises from server
    const response = await fetch(EXERCISES_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const dbExercises: ExerciseInsert[] = data.map(
      (apiExercise: ApiExercise) => ({
        id: apiExercise.id,
        name: apiExercise.name,
        force: apiExercise.force ?? null,
        level: apiExercise.level ?? "intermediate",
        mechanic: apiExercise.mechanic ?? null,
        equipment: apiExercise.equipment ?? null,
        primaryMuscles: JSON.stringify(apiExercise.primaryMuscles),
        secondaryMuscles: JSON.stringify(apiExercise.secondaryMuscles),
        instructions: JSON.stringify(apiExercise.instructions),
        category: apiExercise.category,
        images: JSON.stringify(apiExercise.images),
        updatedAt: new Date().toISOString(),
        isSynced: 1,
        isUserCreated: 0,
      }),
    );
    // Load exercises into database
    await this.db.insert(exercisesTable).values(dbExercises);
  }

  static async searchExercises(query: string) {
    return await ExerciseService.db
      .select()
      .from(exercisesTable)
      .where(sql`${exercisesTable.name} LIKE ${`%${query}%`}`)
      .all();
  }
}

//example user add custom exercise
// ExerciseService.createUserCustomExercise({
//   id: "custom-exercise-1",
//   name: "Custom Exercise",
//   force: force.pull,
//   level: level.beginner,
//   mechanic: mechanic.compound,
//   equipment: equipment.bodyOnly,
//   primaryMuscles: JSON.stringify([primaryMuscles.biceps]),
//   secondaryMuscles: JSON.stringify([secondaryMuscles.triceps]),
//   instructions: JSON.stringify(["Step 1", "Step 2"]),
//   category: "custom",
//   images: JSON.stringify(["image1.jpg", "image2.jpg"]),
//   updatedAt: new Date().toISOString(),
//   isSynced: 0,
//   isUserCreated: 1,
// });
