import db from './db.js'

await db.read()

// Wenn noch keine Daten vorhanden sind, initialisieren
db.data ||= { todos: [], users: [] }

db.data.todos.push({
  user: "antonia",
  text: "Testaufgabe aus Terminal",
  done: false
})

await db.write()

console.log("✅ Testaufgabe wurde gespeichert!")