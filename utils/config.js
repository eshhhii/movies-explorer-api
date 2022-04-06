require("dotenv").config();

const { NODE_ENV, JWT_SECRET, MONGO } = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
  MONGO:
    NODE_ENV === "production" ? MONGO : "mongodb://localhost:27017/bitfilmsdb",
};
