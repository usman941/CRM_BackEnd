const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

const UserRouter = Router();

UserRouter.route("/register").post(UserController.create);
UserRouter.route("/login").post(UserController.login);
UserRouter.route("/logout").delete(UserController.logout);
UserRouter.route("/me").get(AuthMiddleware,UserController.me);


module.exports = UserRouter