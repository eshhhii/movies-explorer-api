const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validatonURL = (value) => {
  const isValid = validator.isURL(value);
  if (isValid) {
    return value;
  }
  throw new Error("Неверный формат ссылки");
};

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validatonURL),
    trailer: Joi.string().required().custom(validatonURL),
    thumbnail: Joi.string().required().custom(validatonURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validationCreateMovie,
  validationMovieId,
  validationCreateUser,
  validationUpdateUser,
  validationLogin,
};
