const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const whitelist = require("./white-list-origin.config");
const { getAdmin, getCustomer } = require("../helpers/Common.helper");
const { UserModel } = require("../models");
const { UserMiddle } = require("../middlewares");

require("dotenv").config();
/**
 * It sets up the Express server to use the CORS middleware, parses the request body, and sets up the
 * routes
 * @param app - The express app object
 */
function ExpressConfigs(app) {
  /* A middleware that allows cross-origin resource sharing, which means we can access our API from a
 domain other than it’s own. */
  let corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  corsOptions = {};

  app.use(cors(corsOptions));

  app.use(express.json({ limit: "100mb" }));
  app.use(express.text({ limit: "100mb" }));
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "100mb",
      extended: true,
      parameterLimit: 100000,
    })
  );

  //file access
  app.use("/uploads", express.static("uploads"));
  app.use("/files", express.static("storage"));

  app.use(function (req, res, next) {
    global.currentHttpRequest = req;
    global.currentHttpResponse = res;
    next();
  });

  app.use(UserMiddle);

  // Start listen on http request
  app.get("/", (req, res) => {
    res.json({ message: `Welcome to ${process.env.APP_NAME}` });
  });

  app.use("/api", require("../routers/")(app));
}

module.exports = ExpressConfigs;
