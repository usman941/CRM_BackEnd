const Router = require("express");
const ContactRouter = require("./contact.route");
const ConversationRouter = require("./conversation.route");
const LeadRouter = require("./lead.route");
const TaskRouter = require("./task.route");
const UserRouter = require("./user.route");
const UserManagementRouter = require("./user_management.route");
const BlogRouter = require("./blog.route")

const RootRoute = Router();

RootRoute.get("/", (req, res) => {
    res.send("Welcome to the API")
});

RootRoute.use("/user", UserRouter)
RootRoute.use("/lead", LeadRouter)
RootRoute.use("/conversation", ConversationRouter)
RootRoute.use("/user_management", UserManagementRouter)
RootRoute.use("/task", TaskRouter)
RootRoute.use("/contact", ContactRouter)
RootRoute.use("/blog", BlogRouter)

module.exports = RootRoute
