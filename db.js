import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Datei, in der gespeichert wird
const file = './data.json'
const adapter = new JSONFile(file)

// 🛠️ NEU: defaultData als Startwert setzen
const defaultData = { todos: [], users: [] }

const db = new Low(adapter, defaultData)

await db.read()

// Optional: Wenn keine Daten vorhanden sind, schreiben
if (!db.data) {
  db.data = defaultData
  await db.write()
}

export default db