import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync("db.db", { enableChangeListener: true });
  }
  return db;
};

// Create drizzle database instance
export const getDrizzle = () => {
  return drizzle(getDatabase());
};
