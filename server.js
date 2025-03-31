import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import db from "./db.js"

const app = express()
const PORT = 3001

// __dirname für ES-Module rekonstruieren
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// EJS einrichten
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Dummy-Nutzer
const users = [
  { email: "antonia.wittrin@gmail.com", password: "Musikerin911" },
  { email: "linus.wittrin@gmail.com", password: "Mindstorms1!" },
  { email: "shanayalim06@gmail.com", password: "Hund123" }
]

// Route: Startseite (Login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Route: About (optional)
app.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"))
})

// ✅ Login-Route MIT verbessertem username
app.post("/login", (req, res) => {
  const { email, password } = req.body
  const userMatch = users.find(u => u.email === email && u.password === password)

  if (userMatch) {
    // ✨ USERNAME aus Email: antonia.wittrin@gmail.com → antonia.wittrin
    const username = email.split("@")[0] + "." + email.split("@")[1].split(".")[0]
    res.redirect(`/dashboard/${username}`)
  } else {
    res.send("Login fehlgeschlagen – bitte zurück und erneut versuchen.")
  }
})

// Route: Dashboard – zeigt To-Dos & Fortschritt
app.get("/dashboard/:user", async (req, res) => {
  const username = req.params.user

  await db.read()

  // To-Dos dieses Users
  const todos = db.data.todos.filter(todo => todo.user === username)

  // Eigener Fortschritt
  const userDone = todos.filter(t => t.done).length
  const userProgress = Math.round((userDone / todos.length || 0) * 100)

  // Fortschritt aller Nutzer
  const usersInDb = Array.from(new Set(db.data.todos.map(t => t.user)))
  const progress = {}

  usersInDb.forEach(u => {
    const userTodos = db.data.todos.filter(t => t.user === u)
    const done = userTodos.filter(t => t.done).length
    progress[u] = Math.round((done / userTodos.length || 0) * 100)
  })

  const colors = {
    "antonia.wittrin": "#4caf50",
    "linus.wittrin": "#2196f3",
    "shanayalim06": "#ff9800"
  }

  res.render("dashboard", { username, todos, progress, colors })
})

// Route: ➕ To-Do hinzufügen
app.post("/add", async (req, res) => {
  const { user, text } = req.body
  const allowedUsers = ["antonia.wittrin", "linus.wittrin", "shanayalim06"];
  if (!allowedUsers.includes(user)) {
    return res.send("Unknown user.");
  }

  await db.read()

  const existing = db.data.todos.find(todo => todo.user === user && todo.text === text)
  if (!existing) {
    db.data.todos.push({ user, text, done: false })
    await db.write()
  }

  res.redirect(`/dashboard/${user}`)
})

// Route: ✅ To-Do abhaken / toggeln
app.post("/toggle", async (req, res) => {
  const { user, text } = req.body;

  await db.read();

  const todo = db.data.todos.find(t => t.user === user && t.text === text);
  if (todo) {
    todo.done = !todo.done;
    await db.write();
  }

  res.redirect(`/dashboard/${user}`); // ⬅️ ganz wichtig!
});

// Route: 🗑️ To-Do löschen
app.post("/delete", async (req, res) => {
  const { user, text } = req.body

  await db.read()

  db.data.todos = db.data.todos.filter(t => !(t.user === user && t.text === text))
  await db.write()

  res.redirect(`/dashboard/${user}`)
})

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft unter http://localhost:${PORT}`)
})