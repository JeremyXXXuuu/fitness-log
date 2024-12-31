import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  index,
  real,
} from "drizzle-orm/sqlite-core";
import {
  MacrosGoal,
  ActivityLevel,
  force,
  level,
  mechanic,
  equipment,
  category,
  primaryMuscles,
  secondaryMuscles,
  workoutLogExercise,
} from "./types";

export const usersTable = sqliteTable(
  "users_table",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    server_id: text().unique(), // Server-side unique identifier
    name: text().notNull(),
    age: integer().notNull(),
    email: text().notNull().unique(),
    weight: real().default(0),
    height: real().default(0),
    body_fat_percentage: real().default(0),
    activity_level: text({
      enum: Object.values(ActivityLevel) as [string, ...string[]],
    }).default("Sedentary"),
    calorires_goal: real().default(0),
    macros_goal: text({ mode: "json" }).$type<MacrosGoal>(),
    extra: text({ mode: "json" }),
    // authentication related fields
    auth: text({ mode: "json" }),
    oauth: text({ mode: "json" }),
    // Sync related fields
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    deleted_at: text(), // Soft delete
    is_synced: integer().default(0), // 0: not synced, 1: synced
    sync_version: integer().default(0), // Increment on each update
  },
  t => [
    index("email_idx").on(t.email),
    index("name_age_idx").on(t.name, t.age),
    index("sync_idx").on(t.is_synced, t.sync_version),
    index("server_id_idx").on(t.server_id),
  ],
);

export const exercisesTable = sqliteTable(
  "exercises",
  {
    uuid: text("uuid")
      .primaryKey()
      .notNull()
      .default(sql`(lower(hex(randomblob(16))))`),
    id: text("id"),
    name: text("name").notNull(),
    force: text("force", {
      enum: Object.values(force) as [string, ...string[]],
    }),
    level: text("level", {
      enum: Object.values(level) as [string, ...string[]],
    }),
    mechanic: text("mechanic", {
      enum: Object.values(mechanic) as [string, ...string[]],
    }),
    equipment: text("equipment", {
      enum: Object.values(equipment) as [string, ...string[]],
    }),
    primaryMuscles: text("primary_muscles", {
      enum: Object.values(primaryMuscles) as [string, ...string[]],
    }),
    secondaryMuscles: text("secondary_muscles", {
      enum: Object.values(secondaryMuscles) as [string, ...string[]],
    }),
    instructions: text("instructions"), // Store as JSON string
    category: text("category", {
      enum: Object.values(category) as [string, ...string[]],
    }),
    images: text("images"), // Store as JSON string
    updatedAt: text("updated_at").notNull(), // Timestamp for sync
    isUserCreated: integer("is_user_created").default(0),
    isSynced: integer("is_synced").default(0),
  },
  t => [
    index("id_idx").on(t.id),
    index("name_idx").on(t.name),
    index("level_idx").on(t.level),
    index("category_idx").on(t.category),
    index("is_synced_idx").on(t.isSynced),
  ],
);

// workout log table, to store user's workout logs, this will be used to sync with the server
// and also to show the user's workout history
export const workoutLogTable = sqliteTable(
  "workout_log",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    user_id: integer().notNull(),
    exercises: text({ mode: "json" }).$type<workoutLogExercise[]>().notNull(),
    notes: text(),
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    deleted_at: text(),
    duration: integer().default(0),
    is_synced: integer().default(0),
  },
  t => [index("user_id_idx").on(t.user_id)],
);
