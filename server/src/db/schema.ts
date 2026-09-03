import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "../schema.ts";

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.name)],
);
