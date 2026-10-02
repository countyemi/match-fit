const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const port = Number(process.env.PORT) || 3001;
const dataDirectory = path.join(process.cwd(), "data", "users");

app.use(express.json({ limit: "1mb" }));

function normalizeUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function userFile(username) {
  const normalized = normalizeUsername(username);
  if (!/^[\p{L}\p{N} _-]{1,40}$/u.test(normalized)) return null;
  const safeName = Buffer.from(normalized, "utf8").toString("base64url");
  return path.join(dataDirectory, `${safeName}.json`);
}

app.get("/api/users", async (_request, response) => {
  try {
    const files = await fs.readdir(dataDirectory).catch(() => []);
    const usernames = [];
    for (const file of files.filter((name) => name.endsWith(".json"))) {
      try {
        const saved = JSON.parse(await fs.readFile(path.join(dataDirectory, file), "utf8"));
        if (saved.username) usernames.push(saved.username);
      } catch {
        // Ignore malformed user files so one bad record doesn't block sign-in.
      }
    }
    response.json(usernames);
  } catch {
    response.status(500).json({ error: "Could not load usernames." });
  }
});

app.get("/api/users/:username", async (request, response) => {
  const file = userFile(request.params.username);
  if (!file) return response.status(400).json({ error: "Invalid username." });
  try {
    const saved = JSON.parse(await fs.readFile(file, "utf8"));
    return response.json(saved);
  } catch (error) {
    if (error.code === "ENOENT") return response.status(404).json({ error: "User not found." });
    return response.status(500).json({ error: "Could not read saved progress." });
  }
});

app.put("/api/users/:username", async (request, response) => {
  const file = userFile(request.params.username);
  if (!file) return response.status(400).json({ error: "Invalid username." });
  const username = normalizeUsername(request.params.username);
  try {
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(file, JSON.stringify({ username, state: request.body }, null, 2), "utf8");
    return response.json({ ok: true });
  } catch {
    return response.status(500).json({ error: "Could not save progress." });
  }
});

app.get("/api/health", (_request, response) => response.json({ ok: true }));

if (process.env.NODE_ENV === "production" || process.argv.includes("production")) {
  const distDirectory = path.join(process.cwd(), "dist");
  app.use(express.static(distDirectory));
  app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api/")) return next();
    response.sendFile(path.join(distDirectory, "index.html"));
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Match Fit API listening on http://localhost:${port}`);
  console.log(`User JSON files: ${dataDirectory}`);
});