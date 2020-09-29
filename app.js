const express = require("express");
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");

const app = express();
const hbs = exphbs.create();

const port = process.env.PORT || 3000;
const { handlebars } = require("hbs");

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(`public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const service = require("./services/storage.js");
const getPilots = service.getPilots;
const getSinglePilot = service.getSinglePilot;

app.get("/pilotList", (req, res) => {
  const pilots = getPilots();

  res.render("home", {
    layout: "layout",
    pilots,
  });
});

app.get("/pilotList/:id", (req, res) => {
  const singlePilot = getSinglePilot(req.params.id);

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

/*-----------API STARTS HERE--------
-------------------------------------*/

app.get("/pilots", (req, res, next) => {
  const pilots = getPilots();
  return res.send(pilots);
});

app.get("/pilots/:id", (req, res, next) => {
  const singlePilot = getSinglePilot(req.params.id);
  return res.send(singlePilot);
});

app.get("/pilots/perpage/:number", (req, res) => {
  const pilots = getPilots();

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
