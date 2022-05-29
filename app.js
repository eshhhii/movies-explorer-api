require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { notFoundPage } = require('./middlewares/notFoundPage');
const { handleError } = require('./middlewares/handleError');
const { rateLimiter } = require('./utils/limiter');
const { CURRENT_MONGO, CURRENT_PORT } = require('./utils/config');

const mainRouter = require('./routes/index');

const limiter = rateLimit(rateLimiter);
const app = express();

const options = {
  origin: [
  "localhost:3000",
  "http://localhost:3000",
  "localhost:3001",
  "http://localhost:3001",
  "https://api.eshhhii-diploma.nomoredomains.rocks",
  "http://api.eshhhii-diploma.nomoredomains.rocks",
  "https://eshhhii-diploma.nomoredomains.xyz",
  "http://eshhhii-diploma.nomoredomains.xyz",
],
methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
preflightContinue: false,
optionsSuccessStatus: 204,
allowedHeaders: ["Content-Type", "origin", "Authorization", "Accept"],
credentials: true,
};

app.use("*", cors(options));

app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

/*app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.status(200).send();
  }

  return next();
});*/

app.use(helmet());

// Подлключаемся к БД
mongoose.connect(CURRENT_MONGO, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use('/', mainRouter);
app.all('*', notFoundPage);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(CURRENT_PORT, () => {
  console.log(`App listening on port ${CURRENT_PORT}`);
});