const { Router } = require("express");
const FormController = require("../controllers/forms.controller");
const FormAuthMiddleware = require("../middlewares/form-auth.middleware");

const FormRouter = Router();

FormRouter.route("/ref/:token").get(FormController.index);
FormRouter.route("/login/:ref").get(FormController.login);
FormRouter.route("/login").post(FormController.loginPost);
FormRouter.route("/register").post(FormController.register);
FormRouter.route("/dashboard/application").get(FormAuthMiddleware,FormController.dashboard);
FormRouter.route("/dashboard/documents").get(FormAuthMiddleware,FormController.documentUpload);
FormRouter.route("/dashboard/documents/action").post(FormAuthMiddleware,FormController.documentUploadPost);
FormRouter.route("/logout").get(FormAuthMiddleware,FormController.logout);
FormRouter.route("/dashboard/action").post(FormAuthMiddleware,FormController.dashboardAction);
FormRouter.route("/dashboard/action/:id").post(FormAuthMiddleware,FormController.dashboardAction);


module.exports = FormRouter