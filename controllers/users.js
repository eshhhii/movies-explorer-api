const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const BadRequest = require("../errors/BadRequest");
const BadAuth = require("../errors/BadAuth");
const NotFound = require("../errors/NotFound");
const BadUnique = require("../errors/BadUnique");

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound("Нет пользователя с таким id");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest(
          "Переданы некорректные данные в методы получения пользователя"
        );
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).send(user.toJSON()))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest(
          "Переданы некорректные данные в методы создания пользователя"
        );
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new BadUnique("Пользователь с таким email уже существует"));
      }
      return next(err);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { email, name },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest(
          "Переданы некорректные данные в методы обновления профиля"
        );
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new BadUnique("Пользователь с таким email уже существует"));
      }
      return next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new NotFound("Нет пользователя с таким id");
      } else {
        bcrypt.compare(password, user.password, (error, isValid) => {
          if (error) {
            throw new BadRequest("Неверный запрос");
          }
          if (!isValid) {
            throw new BadAuth("Неправильный пароль");
          }
          if (isValid) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
              { expiresIn: "7d" }
            );
            res
              .cookie("jwt", token, {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
                sameSite: "none",
                secure: true,
              })
              .send({ message: "Вы авторизовались", token });
          }
        });
      }
    })
    .catch(() => {
      throw new BadAuth("Ошибка авторизации");
    })
    .catch(next);
};
const signOut = (req, res) => {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("Успешно");
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
  signOut,
};
