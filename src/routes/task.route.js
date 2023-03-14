const { Router } = require("express");
const Controller = require("../controllers/task.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const ServiceAuthMiddleware = require("../middlewares/service.auth.middleware");

const TaskRouter = Router();

TaskRouter.route("/add").post(AuthMiddleware,Controller.createTask);
TaskRouter.route("/").get(AuthMiddleware,Controller.getTaskByAdmin);
TaskRouter.route("/user").get(ServiceAuthMiddleware,Controller.getTaskByUser);
TaskRouter.route("/update/:id").put(AuthMiddleware,Controller.updateTaskStatus);
TaskRouter.route("/update/user_status/:id").put(ServiceAuthMiddleware,Controller.updateStatus);
TaskRouter.route("/delete/:id").delete(AuthMiddleware,Controller.deleteTask);

module.exports = TaskRouter