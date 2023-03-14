const { Router } = require("express");
const LeadController = require("../controllers/lead.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const ServiceMiddleware = require("../middlewares/service.auth.middleware");

const LeadRouter = Router();

LeadRouter.route("/add").post(AuthMiddleware, LeadController.createLead);
LeadRouter.route("/user/add").post(ServiceMiddleware, LeadController.addLeadByCompanyUser);
LeadRouter.route("/").get(AuthMiddleware, LeadController.getLeads);
LeadRouter.route("/user_all").get(ServiceMiddleware, LeadController.getAllLeadsByCompanyUser);
LeadRouter.route("/params/:id").get(AuthMiddleware, LeadController.getLeadById);
LeadRouter.route("/user/params/:id").get(ServiceMiddleware, LeadController.getLeadByCompanyUserId);
LeadRouter.route("/delete/:id").delete(AuthMiddleware, LeadController.deleteLead);
LeadRouter.route("/referral").post(AuthMiddleware, LeadController.createReferral);
LeadRouter.route("/export/excel").get(LeadController.exportLeadsToExcel);



module.exports = LeadRouter