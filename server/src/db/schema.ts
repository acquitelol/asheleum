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
  (table) => [
    unique().on(table.id, table.userId),
    unique().on(table.userId, table.name),
  ],
);

export const album = pgTable(
  "album",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    artist: text("artist").notNull(),
    cover: text("cover").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.id)],
);

export const userAlbum = pgTable(
  "user_album",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    albumId: text("album_id")
      .notNull()
      .references(() => album.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.userId, table.albumId)],
);

export const albumTag = pgTable(
  "album_tag",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    albumId: text("album_id")
      .notNull()
      .references(() => album.id, { onDelete: "cascade" }),

    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.userId, table.albumId, table.tagId)],
);
