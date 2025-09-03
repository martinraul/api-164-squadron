const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const db = new sqlite3.Database("./data/squadron.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the squadron database.");
});

function createTable() {
  db.run(
    "CREATE TABLE IF NOT EXISTS pilots (id INTEGER PRIMARY KEY, name TEXT, callsign TEXT, rank TEXT, image TEXT)",
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Pilots table created or already exists.");
    }
  );
}

function getPilots(callback) {
  db.all("SELECT * FROM pilots", (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    callback(rows);
  });
}

function getSinglePilot(id, callback) {
  db.get("SELECT * FROM pilots WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    callback(row);
  });
}

function loadData() {
  db.get("SELECT COUNT(*) as count FROM pilots", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    if (row.count === 0) {
      const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
      const pilotsData = JSON.parse(jsonPilots);

      const stmt = db.prepare("INSERT INTO pilots (id, name, callsign, rank, image) VALUES (?, ?, ?, ?, ?)");
      for (const pilot of pilotsData) {
        stmt.run(pilot.id, pilot.name, pilot.callsign, pilot.rank, pilot.image);
      }
      stmt.finalize();
      console.log("Data loaded successfully");
    } else {
      console.log("Data already loaded");
    }
  });
}

module.exports = {
  createTable,
  getPilots,
  getSinglePilot,
  loadData,
};