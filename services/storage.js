const fs = require("fs");

function getPilots() {
  const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
  const pilots = JSON.parse(jsonPilots);
  return pilots;
}

function getSinglePilot(id) {
  const pilots = getPilots()
  let singlePilot;
  for (let i = 0; i < pilots.length; i++) {
    if (Number(pilots[i].id) === Number(id)) {
      singlePilot = pilots[i];
    }
  }
  return singlePilot;
}

module.exports = {
  getPilots,
  getSinglePilot,
};
