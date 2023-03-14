const { Router } = require("express");
const ConversationController = require("../controllers/conversation.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

const ConversationRouter = Router();

ConversationRouter.route("/send").post(AuthMiddleware, ConversationController.messageByEmail);
ConversationRouter.route("/sms").post(AuthMiddleware, ConversationController.messageBySMS);
ConversationRouter.route("/").get(AuthMiddleware, ConversationController.getAllConversations);

module.exports = ConversationRouter