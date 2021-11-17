const jwt = require("jsonwebtoken");
const BadAuth = require("../errors/BadAuth");

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new BadAuth("Авторизация не прошла"));
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(
        token,
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
      );
    } catch (err) {
      next(new BadAuth("Авторизация не прошла"));
    }
    req.user = payload;

    next();
  }
};

module.exports = auth;
