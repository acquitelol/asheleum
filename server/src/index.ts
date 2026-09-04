import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { registerTags } from "./routes/tags.ts";
import { registerAlbums } from "./routes/albums.ts";

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

registerTags(app);
registerAlbums(app);
