const mongoose = require("mongoose");
require("dotenv").config();

function initializeMongoDB() {
  const MONGO_DB_URL =
    process.env.MONGO_DB_URL ??
    (process.env.APP_ENVIRONMENT == "production"
      ? `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_SERVER_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
      : `mongodb://localhost:27017/${
          process.env.MONGO_DB_NAME || "local_template_db"
        }`);

  mongoose.connect(
    MONGO_DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err) {
      if (err) {
        console.error("MongoDB connection error: " + err);
      }
    }
  );

  mongoose.set("strictQuery", false);

  mongoose.connection
    .on("error", console.error.bind(console, "connection error: "))
    .once("open", function () {
      print(
        `Application connected to database successfully ${mongoose.connection.name}`
      );
    });

  mongoose.connection.once("open", function () {
    console.info("MongoDB event open");
    console.debug("MongoDB connected [%s]", MONGO_DB_URL);

    mongoose.connection.on("connected", function () {
      console.info("MongoDB event connected");
    });

    mongoose.connection.on("disconnected", function () {
      console.warn("MongoDB event disconnected");
    });

    mongoose.connection.on("reconnected", function () {
      console.info("MongoDB event reconnected");
    });

    mongoose.connection.on("error", function (err) {
      console.error("MongoDB event error: " + err);
    });
  });
}

module.exports = initializeMongoDB;
