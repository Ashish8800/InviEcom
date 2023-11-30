require("dotenv").config();
require("./configs/global.config")();
const express = require("express"),
  ExpressUrlList = require("./helpers/ExpressUrlList.helper"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  app = express(),
  ip = require("ip"),
  PORT = process.env.APP_PORT || 5000;

global.app_url = `http://${ip.address()}:${PORT}`;

require("./configs/express.config")(app);
require("./database/database")();

app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
  if (process.env.APP_ENIVERMENT != "production") {
    ExpressUrlList(app);
  }
  print(`Server started on port => ${PORT}, API URL: ${global.app_url}`);
});
