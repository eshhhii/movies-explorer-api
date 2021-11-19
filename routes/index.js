const router = require("express").Router();

const { createUser, login, signOut } = require("../controllers/users");
const {
  validationCreateUser,
  validationLogin,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const movieRouter = require("./movies");
const NotFound = require("../errors/NotFound");

router.post("/signup", validationCreateUser, createUser);
router.post("/signin", validationLogin, login);
router.delete("/signout", signOut);

router.use("/", auth, userRouter);
router.use("/", auth, movieRouter);
router.use("*", auth, () => {
  throw new NotFound("Роутер не найден");
});

module.exports = router;
