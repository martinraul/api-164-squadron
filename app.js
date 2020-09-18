const express = require("express");
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");
const fs = require("fs");

const app = express();
const hbs = exphbs.create();

const port = process.env.PORT || 3000;
const { handlebars } = require("hbs");

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(`public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/pilots", (req, res) => {
  const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
  const pilots = JSON.parse(jsonPilots);

  res.render("home", {
    layout: "layout",
    pilots,
  });
});

app.get("/pilot/:id", (req, res) => {
  const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
  const pilots = JSON.parse(jsonPilots);

  let singlePilot;
  for (let i = 0; i < pilots.length; i++) {
    if (Number(pilots[i].id) === Number(req.params.id)) {
      singlePilot = pilots[i];
    }
  }

  res.render("pilot", {
    layout: "layout",
    singlePilot,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layout",
  });
});

app.get("/", (req, res) => {
  res.render("api", {
    layout: "layout",
  });
});

/*-----------API STARTS HERE---------*/

app.get("/pilots", (req, res, next) => {
  const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
  return res.send(jsonPilots);
});

app.get("/pilots/:number", (req, res) => {
  const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
  const pilots = JSON.parse(jsonPilots);

  const pageCount = Math.ceil(pilots.length / `${req.params.number}`);
  let page = parseInt(req.query.p);
  if (!page) {
    page = 1;
  }
  if (page > pageCount) {
    page = pageCount;
  }
  res.json({
    page: page,
    pageCount: pageCount,
    pilots: pilots.slice(
      page * `${req.params.number}` - `${req.params.number}`,
      page * `${req.params.number}`
    ),
  });
});

app.get("/pilots/:id", (req, res, next) => {
  const jsonPilots = fs.readFileSync("./data/pilots.json", "utf-8");
  const pilots = JSON.parse(jsonPilots);

  console.log(pilots[`${req.params.id}`]);
  return res.send(pilots[req.params.id]);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
