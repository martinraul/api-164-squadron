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

const pjson = require('./package.json');
app.locals.version = pjson.version;

const service = require("./services/sqlite.js");
service.createTable();
service.loadData();

const apiRoutes = require('./routes/api');
const viewRoutes = require('./routes/views');

app.use('/', viewRoutes);
app.use('/', apiRoutes);

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

module.exports = app;
