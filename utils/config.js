require('dotenv').config();

const {
  MONGO,
  JWT_SECRET,
  PORT,
  NODE_ENV,
} = process.env;

const CURRENT_JWT_SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 3000;
const CURRENT_MONGO = NODE_ENV === 'production' && MONGO ? MONGO : 'mongodb://127.0.0.1:27017/moviesdb';

module.exports = {
  CURRENT_JWT_SECRET,
  CURRENT_MONGO,
  CURRENT_PORT,
};
