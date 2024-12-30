import { getDrizzle } from "./db";
import { usersTable } from "./schema";
import { eq } from "drizzle-orm";

// User related database operations
export class UserService {
  static db = getDrizzle();

  static async createUser(data: { name: string; age: number; email: string }) {
    return await UserService.db.insert(usersTable).values(data);
  }

  static async getUserByEmail(email: string) {
    return await UserService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();
  }

  static async getAllUsers() {
    return await UserService.db.select().from(usersTable).all();
  }

  static async deleteAllUsers() {
    return await UserService.db.delete(usersTable);
  }

  static async setCaloriesGoal(userId: number, calories: number) {
    return await UserService.db
      .update(usersTable)
      .set({ calorires_goal: calories })
      .where(eq(usersTable.id, userId));
  }

  static async setMacrosGoal(
    userId: number,
    macros: { fat: number; protein: number; carbs: number },
  ) {
    return await UserService.db
      .update(usersTable)
      .set({ macros_goal: macros })
      .where(eq(usersTable.id, userId));
  }
}
