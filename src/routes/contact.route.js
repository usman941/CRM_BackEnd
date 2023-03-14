const { Router } = require("express");
const Controller = require("../controllers/contact.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

const ContactRouter = Router();

ContactRouter.route('/add').post(AuthMiddleware, Controller.createContact);
ContactRouter.route('/').get(AuthMiddleware, Controller.getContacts);
ContactRouter.route('/send/:contact_group_id').post(AuthMiddleware, Controller.messageToContactGroup);
// ContactRouter.route('/update/:contact_id').put(AuthMiddleware, Controller.updateContact);

module.exports = ContactRouter