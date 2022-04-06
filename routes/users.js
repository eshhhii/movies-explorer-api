const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validationUpdateUser } = require("../middlewares/validation");

router.get("/users/me", getCurrentUser);
router.patch("/users/me", validationUpdateUser, updateUser);

module.exports = router;
