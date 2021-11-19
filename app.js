require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const { limiter } = require("./middlewares/limiter");
const handleError = require("./middlewares/handleError");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/bitfilmsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const options = {
  origin: ["http://localhost:3000", "https://localhost:3000"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "origin", "Authorization", "Accept"],
  credentials: true,
};

app.use("*", cors(options));

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

/* eslint-disable no-console */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
