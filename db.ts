const mongooseDB = require("mongoose");
const dotenv = require("dotenv").config();

const MongoURL = process.env.MongoURL || "";

mongooseDB
  .connect(MongoURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: Error) => {
    console.error("Error connecting to MongoDB:", err);
  });
