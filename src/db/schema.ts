import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  index,
  real,
} from "drizzle-orm/sqlite-core";
import { MacrosGoal, ActivityLevel } from "./types";

export const devicesTable = sqliteTable("devices", {
  id: integer().primaryKey({ autoIncrement: true }),
  device_id: text().notNull().unique(), // Unique device identifier
  user_id: integer().references((): any => usersTable.id, {
    onDelete: "cascade",
  }), // Associated user
  device_type: text().notNull(), // Mobile, tablet, desktop, etc.
  last_sync: text().default(sql`(CURRENT_TIMESTAMP)`),
  sync_token: text(), // Incremental sync token
});

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
    device_id: integer().references((): any => devicesTable.id), // Device that created/modified this record
  },
  t => [
    index("email_idx").on(t.email),
    index("name_age_idx").on(t.name, t.age),
    index("sync_idx").on(t.is_synced, t.sync_version),
    index("server_id_idx").on(t.server_id),
  ],
);

export const syncLogTable = sqliteTable("sync_log", {
  id: integer().primaryKey({ autoIncrement: true }),
  table_name: text().notNull(),
  record_id: integer().notNull(),
  operation: text().notNull(), // INSERT, UPDATE, DELETE
  sync_status: text().notNull(), // PENDING, SUCCESS, FAILED
  created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
  device_id: text().references(() => devicesTable.device_id),
  error_message: text(),
});

// export const foodItemsTable = sqliteTable("food_items", {
//   id: integer().primaryKey({ autoIncrement: true }),
//   name: text().notNull(),
//   calories: real().notNull(),
//   protein: real().notNull(),
//   carbs: real().notNull(),
//   fat: real().notNull(),
//   createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
// });

// export const foodLogsTable = sqliteTable("food_logs", {
//   id: integer().primaryKey({ autoIncrement: true }),
//   userId: integer()
//     .notNull()
//     .references(() => usersTable.id),
//   foodItemId: integer()
//     .notNull()
//     .references(() => foodItemsTable.id),
//   servingSize: real().notNull(),
//   loggedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
// });
