require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const { notFoundPage } = require("./middlewares/notFoundPage");
const { handleError } = require("./middlewares/handleError");
const { rateLimiter } = require("./utils/limiter");
const { CURRENT_MONGO, CURRENT_PORT } = require("./utils/config");

const mainRouter = require("./routes/index");

const limiter = rateLimit(rateLimiter);
const app = express();

// Подлключаемся к БД
mongoose.connect(CURRENT_MONGO, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(express.json());

app.use("/", mainRouter);
app.all("*", notFoundPage);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(CURRENT_PORT, () => {
  console.log(`App listening on port ${CURRENT_PORT}`);
});
