import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "./db/index.ts";
import { tag } from "./db/schema.ts";
import { eq } from "drizzle-orm";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ user: null });
  }

  return res.json({
    user: session.user,
  });
});

app.get("/api/tags", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tags = await db
    .select()
    .from(tag)
    .where(eq(tag.userId, session.user.id));

  return res.json(tags);
});

app.post("/api/tags", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: "Tag name is required" });
  }

  const [newTag] = await db
    .insert(tag)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      name,
    })
    .returning();

  return res.json(newTag);
});
