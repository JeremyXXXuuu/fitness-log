import { getDrizzle } from "./db";
import { workoutLogTable } from "./schema";
import { eq } from "drizzle-orm";
import { workoutLog } from "./types";

type WorkoutLogInsert = typeof workoutLogTable.$inferInsert;

export class WorkoutLogService {
  static db = getDrizzle();

  static async getWorkoutLogById(id: string) {
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

  static async createWorkoutLog(workoutLog: workoutLog) {
    return await WorkoutLogService.db.insert(workoutLogTable).values({
      id: workoutLog.id,
      name: workoutLog.name,
      user_id: workoutLog.user_id,
      exercises: workoutLog.exercises,
      duration: workoutLog.duration,
      created_at: workoutLog.created_at,
      updated_at: workoutLog.updated_at,
      is_synced: workoutLog.is_synced ? 1 : 0,
    });
  }
}
