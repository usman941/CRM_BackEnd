const { Router } = require("express");
const Controller = require("../controllers/user_management.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const ServiceAuthMiddleware = require("../middlewares/service.auth.middleware");

const UserManagementRouter = Router();

UserManagementRouter.route("/add").post(AuthMiddleware,Controller.createUser);
UserManagementRouter.route("/update/:id").put(AuthMiddleware,Controller.updateUser);
UserManagementRouter.route("/").get(AuthMiddleware,Controller.getUsers);
UserManagementRouter.route("/login").post(Controller.loginUser);
UserManagementRouter.route("/me").get(ServiceAuthMiddleware, Controller.profile);
UserManagementRouter.route("/logout").get(ServiceAuthMiddleware, Controller.logoutUser);

module.exports = UserManagementRouter