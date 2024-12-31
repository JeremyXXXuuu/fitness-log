import { getDrizzle } from "./db";
import { workoutLogTable } from "./schema";
import { eq } from "drizzle-orm";

type WorkoutLogInsert = typeof workoutLogTable.$inferInsert;

export class WorkoutLogService {
  static db = getDrizzle();

  static async getWorkoutLogById(id: number) {
    return await WorkoutLogService.db
      .select()
      .from(workoutLogTable)
      .where(eq(workoutLogTable.id, id))
      .get();
  }

  static async getAllWorkoutLogs() {
    return await WorkoutLogService.db.select().from(workoutLogTable).all();
  }

  static async deleteAllWorkoutLogs() {
    return await WorkoutLogService.db.delete(workoutLogTable);
  }

  static async createWorkoutLog(workoutLog: WorkoutLogInsert) {
    return await WorkoutLogService.db
      .insert(workoutLogTable)
      .values(workoutLog);
  }
}
