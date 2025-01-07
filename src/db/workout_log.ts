import { getDrizzle } from "./db";
import { workoutLogTable } from "./schema";
import { eq, sql } from "drizzle-orm";
import { workoutLog } from "./types";

type WorkoutLogInsert = typeof workoutLogTable.$inferInsert;

export class WorkoutLogService {
  static db = getDrizzle();

  static async getWorkoutLog(id: string) {
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

  static async deleteWorkoutLog(id: string) {
    return await WorkoutLogService.db
      .delete(workoutLogTable)
      .where(eq(workoutLogTable.id, id))
      .execute();
  }

  static async createWorkoutLog(workoutLog: workoutLog) {
    return await WorkoutLogService.db.insert(workoutLogTable).values({
      id: workoutLog.id,
      name: workoutLog.name,
      user_id: workoutLog.user_id,
      exercises: workoutLog.exercises,
      duration: workoutLog.duration,
      calendar_date: workoutLog.calendar_date,
      created_at: workoutLog.created_at,
      updated_at: workoutLog.updated_at,
      is_synced: workoutLog.is_synced,
    });
  }

  static async getWorkoutLogsByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    return await WorkoutLogService.db
      .select()
      .from(workoutLogTable)
      .where(
        sql`${workoutLogTable.user_id} = ${userId} 
        AND ${workoutLogTable.calendar_date} >= ${startDate} 
        AND ${workoutLogTable.calendar_date} <= ${endDate}`,
      )
      .all();
  }
}
