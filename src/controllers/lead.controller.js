const Leads = require('../models/Leads');
const Referrals = require('../models/Referral');
const jwt = require('jsonwebtoken');
const emailEvent = require('../helpers/email.config');
const exceljs = require('exceljs');
const Assets = require('../models/Assets');
const AddressInfo = require('../models/Address_info');
const CoBorrowerDetails = require('../models/CoBorrower_Details');
const Creditverifications = require('../models/CreditVerification');
const LoanDetails = require('../models/Loan_details');

const createLead = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            phone,
            email
        } = req.body;

        const lead = new Leads({
            service_id: req.user.service_id,
            firstname,
            lastname,
            phone,
            email
        });

        const newLead = await lead.save();
        if (newLead) {
            res.status(201).json({ message: "Lead created successfully" });
        }
        else {
            res.status(400).json({ message: "Lead creation failed" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getLeads = async (req, res) => {
    try {
        const isLeadService = await Leads.findOne({ service_id: req.user.service_id });

        if (isLeadService) {
            const leads = await Leads.aggregate([
                {
                    $lookup: {
                        from: "leads",
                        localField: "_id",
                        foreignField: "_id",
                        as: "leads"
                    },
                },
                {
                    $lookup: {
                        from: "assets",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "assets"
                    },
                },
                {
                    $lookup: {
                        from: "address_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "address_infos"
                    },
                },
                {
                    $lookup: {
                        from: "military_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "military_infos"
                    },
                },
                {
                    $lookup: {
                        from: "loandetails",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "loandetails"
                    },
                },
                {
                    $lookup: {
                        from: "borrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "borrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "coborrower_details",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrower_details"
                    },
                },
                {
                    $lookup: {
                        from: "coborrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "creditverifications",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "creditverifications"
                    },
                },
                {
                    $lookup: {
                        from: "propertyinfos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "propertyinfos"
                    },
                },
                {
                    $lookup: {
                        from: "realestateagents",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "realestateagents"
                    },
                },
                {
                    $project: {
                        "assets.bank": 1,
                        "assets.bank_account_balance": 1,
                        "assets.bank_account_number": 1,
                        "assets.bank_account_type": 1,
                        "address_infos.current_address": 1,
                        "address_infos.years_at_current_address": 1,
                        "address_infos.month_at_current_address": 1,
                        "address_infos.current_monthly_rent_amount": 1,
                        "address_infos.mailing_address": 1,
                        "address_infos.another_former_address": 1,
                        "leads.firstname": 1,
                        "leads.middlename": 1,
                        "leads.lastname": 1,
                        "leads.email": 1,
                        "leads.phone": 1,
                        "leads.martial_status": 1,
                        "leads.suffix": 1,
                        "military_infos.served_in_military": 1,
                        "loandetails.loan_type": 1,
                        "loandetails.property_type": 1,
                        "loandetails.property_use": 1,
                        "loandetails.estimated_value": 1,
                        "loandetails.current_loan_balance": 1,
                        "loandetails.timeFrame": 1,
                        "loandetails.first_time_home_buyer": 1,
                        "loandetails.purchase_price": 1,
                        "loandetails.down_payment": 1,
                        "loandetails.down_payment_amounts": 1,
                        "loandetails.credit_rating": 1,
                        "borrowerincomes.income_type": 1,
                        "borrowerincomes.additional_income": 1,
                        "coborrower_details.is_co_borrower": 1,
                        "coborrower_details.suffix": 1,
                        "coborrower_details.email": 1,
                        "coborrower_details.phone_number": 1,
                        "coborrower_details.martial_status": 1,
                        "coborrower_details.current_address": 1,
                        "coborrower_details.years_at_current_address": 1,
                        "coborrower_details.month_at_current_address": 1,
                        "coborrower_details.current_monthly_rent_amount": 1,
                        "coborrower_details.mailing_address": 1,
                        "coborrowerincomes.income_type": 1,
                        "creditverifications.borrower_ssn": 1,
                        "creditverifications.borrower_dob": 1,
                        "creditverifications.co_borrower_ssn": 1,
                        "creditverifications.co_borrower_dob": 1,
                        "propertyinfos.subject_property_address": 1,
                        "propertyinfos.city": 1,
                        "propertyinfos.state": 1,
                        "propertyinfos.zip": 1,
                        "realestateagents.is_real_estate_agent": 1,
                        "realestateagents.agent_first_name": 1,
                        "realestateagents.agent_last_name": 1,
                        "realestateagents.agent_email": 1,
                        "realestateagents.agent_phone": 1,
                    }
                },
            ])

            if (leads) {
                res.status(200).json({ leads });
            }
            else {
                res.status(400).json({ message: "No leads found" });
            }
        }
        else {
            res.status(400).json({ message: "No leads found" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadById = async (req, res) => {
    try {
        const id = req.params.id;
        const isLeadService = await Leads.findOne({ _id: id, service_id: req.user.service_id });

        if (isLeadService) {
            const leads = await Leads.aggregate([
                {
                    $lookup: {
                        from: "leads",
                        localField: "_id",
                        foreignField: "_id",
                        as: "leads"
                    },
                },
                {
                    $lookup: {
                        from: "assets",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "assets"
                    },
                },
                {
                    $lookup: {
                        from: "address_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "address_infos"
                    },
                },
                {
                    $lookup: {
                        from: "military_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "military_infos"
                    },
                },
                {
                    $lookup: {
                        from: "loandetails",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "loandetails"
                    },
                },
                {
                    $lookup: {
                        from: "borrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "borrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "coborrower_details",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrower_details"
                    },
                },
                {
                    $lookup: {
                        from: "coborrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "creditverifications",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "creditverifications"
                    },
                },
                {
                    $lookup: {
                        from: "propertyinfos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "propertyinfos"
                    },
                },
                {
                    $lookup: {
                        from: "realestateagents",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "realestateagents"
                    },
                },
                {
                    $project: {
                        "assets.bank": 1,
                        "assets.bank_account_balance": 1,
                        "assets.bank_account_number": 1,
                        "assets.bank_account_type": 1,
                        "address_infos.current_address": 1,
                        "address_infos.years_at_current_address": 1,
                        "address_infos.month_at_current_address": 1,
                        "address_infos.current_monthly_rent_amount": 1,
                        "address_infos.mailing_address": 1,
                        "address_infos.another_former_address": 1,
                        "leads.firstname": 1,
                        "leads.middlename": 1,
                        "leads.lastname": 1,
                        "leads.email": 1,
                        "leads.phone": 1,
                        "leads.martial_status": 1,
                        "leads.suffix": 1,
                        "military_infos.served_in_military": 1,
                        "loandetails.loan_type": 1,
                        "loandetails.property_type": 1,
                        "loandetails.property_use": 1,
                        "loandetails.estimated_value": 1,
                        "loandetails.current_loan_balance": 1,
                        "loandetails.timeFrame": 1,
                        "loandetails.first_time_home_buyer": 1,
                        "loandetails.purchase_price": 1,
                        "loandetails.down_payment": 1,
                        "loandetails.down_payment_amounts": 1,
                        "loandetails.credit_rating": 1,
                        "borrowerincomes.income_type": 1,
                        "borrowerincomes.additional_income": 1,
                        "coborrower_details.is_co_borrower": 1,
                        "coborrower_details.suffix": 1,
                        "coborrower_details.email": 1,
                        "coborrower_details.phone_number": 1,
                        "coborrower_details.martial_status": 1,
                        "coborrower_details.current_address": 1,
                        "coborrower_details.years_at_current_address": 1,
                        "coborrower_details.month_at_current_address": 1,
                        "coborrower_details.current_monthly_rent_amount": 1,
                        "coborrower_details.mailing_address": 1,
                        "coborrowerincomes.income_type": 1,
                        "creditverifications.borrower_ssn": 1,
                        "creditverifications.borrower_dob": 1,
                        "creditverifications.co_borrower_ssn": 1,
                        "creditverifications.co_borrower_dob": 1,
                        "propertyinfos.subject_property_address": 1,
                        "propertyinfos.city": 1,
                        "propertyinfos.state": 1,
                        "propertyinfos.zip": 1,
                        "realestateagents.is_real_estate_agent": 1,
                        "realestateagents.agent_first_name": 1,
                        "realestateagents.agent_last_name": 1,
                        "realestateagents.agent_email": 1,
                        "realestateagents.agent_phone": 1,
                    }
                },
            ])

            if (leads.length > 0) {
                res.status(200).json({ lead: leads.filter(lead => lead._id == id) });
            }
            else {
                res.status(400).json({ message: "No leads found" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteLead = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Leads.findByIdAndDelete({ _id: id });
        if (deleted) {
            res.status(200).json({ message: "Lead deleted successfully" });
        }
        else {
            res.status(400).json({ message: "Lead deletion failed" });
        }
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

const createReferral = async (req, res) => {
    try {
        const { leadId, documents_required } = req.body;
        const isLead = await Leads.findById({ _id: leadId }).select("+firstname +lastname +email +phone");
        if (isLead) {
            const updated = await Leads.findByIdAndUpdate({ _id: leadId }, { documents_required, status: "Application Sent" }, { new: true });
            if (updated) {
                const { firstname, lastname, email, phone } = isLead;
                const serviceId = req.user.service_id;
                const token = jwt.sign({ firstname, lastname, email, phone, serviceId, leadId }, process.env.JWT_SECRET, { expiresIn: "1d" });
                const referralLink = `${process.env.REF_URL}/portal/ref/${token}`;
                const response = await emailEvent(email, "Referral Link", referralLink);
                if (response) {
                    const referral = new Referrals({
                        ref_user_id: req.user._id,
                        service_id: req.user.service_id,
                        lead_id: leadId,
                        firstname,
                        lastname,
                        phone,
                        email,
                        referral_token: token,
                        referral_status: "pending"
                    });

                    const newReferral = await referral.save();
                    if (newReferral) {
                        res.status(201).json({ message: "Referral link sent successfully" });
                    }
                    else {
                        res.status(400).json({ message: "Something went wrong" });
                    }
                }

            }
            else {
                res.status(400).json({ message: "Referral link sent failed" });
            }
        }
        else {
            res.status(400).json({ message: "Lead not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addLeadByCompanyUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            phone,
            email
        } = req.body;

        const lead = new Leads({
            service_id: req.user.service_id,
            company_user_id: req.user.id,
            firstname,
            lastname,
            phone,
            email
        });

        const newLead = await lead.save();
        if (newLead) {
            res.status(201).json({ message: "Lead created successfully" });
        }
        else {
            res.status(400).json({ message: "Lead creation failed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllLeadsByCompanyUser = async (req, res) => {
    try {
        const isLeadService = await Leads.findOne({ service_id: req.user.service_id, company_user_id: req.user.id });

        if (isLeadService) {
            const leads = await Leads.aggregate([
                {
                    $lookup: {
                        from: "leads",
                        localField: "_id",
                        foreignField: "_id",
                        as: "leads"
                    },
                },
                {
                    $lookup: {
                        from: "assets",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "assets"
                    },
                },
                {
                    $lookup: {
                        from: "address_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "address_infos"
                    },
                },
                {
                    $lookup: {
                        from: "military_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "military_infos"
                    },
                },
                {
                    $lookup: {
                        from: "loandetails",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "loandetails"
                    },
                },
                {
                    $lookup: {
                        from: "borrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "borrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "coborrower_details",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrower_details"
                    },
                },
                {
                    $lookup: {
                        from: "coborrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "creditverifications",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "creditverifications"
                    },
                },
                {
                    $lookup: {
                        from: "propertyinfos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "propertyinfos"
                    },
                },
                {
                    $lookup: {
                        from: "realestateagents",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "realestateagents"
                    },
                },
                {
                    $project: {
                        "assets.bank": 1,
                        "assets.bank_account_balance": 1,
                        "assets.bank_account_number": 1,
                        "assets.bank_account_type": 1,
                        "address_infos.current_address": 1,
                        "address_infos.years_at_current_address": 1,
                        "address_infos.month_at_current_address": 1,
                        "address_infos.current_monthly_rent_amount": 1,
                        "address_infos.mailing_address": 1,
                        "address_infos.another_former_address": 1,
                        "leads.firstname": 1,
                        "leads.middlename": 1,
                        "leads.lastname": 1,
                        "leads.email": 1,
                        "leads.phone": 1,
                        "leads.martial_status": 1,
                        "leads.suffix": 1,
                        "leads.company_user_id": 1,
                        "military_infos.served_in_military": 1,
                        "loandetails.loan_type": 1,
                        "loandetails.property_type": 1,
                        "loandetails.property_use": 1,
                        "loandetails.estimated_value": 1,
                        "loandetails.current_loan_balance": 1,
                        "loandetails.timeFrame": 1,
                        "loandetails.first_time_home_buyer": 1,
                        "loandetails.purchase_price": 1,
                        "loandetails.down_payment": 1,
                        "loandetails.down_payment_amounts": 1,
                        "loandetails.credit_rating": 1,
                        "borrowerincomes.income_type": 1,
                        "borrowerincomes.additional_income": 1,
                        "coborrower_details.is_co_borrower": 1,
                        "coborrower_details.suffix": 1,
                        "coborrower_details.email": 1,
                        "coborrower_details.phone_number": 1,
                        "coborrower_details.martial_status": 1,
                        "coborrower_details.current_address": 1,
                        "coborrower_details.years_at_current_address": 1,
                        "coborrower_details.month_at_current_address": 1,
                        "coborrower_details.current_monthly_rent_amount": 1,
                        "coborrower_details.mailing_address": 1,
                        "coborrowerincomes.income_type": 1,
                        "creditverifications.borrower_ssn": 1,
                        "creditverifications.borrower_dob": 1,
                        "creditverifications.co_borrower_ssn": 1,
                        "creditverifications.co_borrower_dob": 1,
                        "propertyinfos.subject_property_address": 1,
                        "propertyinfos.city": 1,
                        "propertyinfos.state": 1,
                        "propertyinfos.zip": 1,
                        "realestateagents.is_real_estate_agent": 1,
                        "realestateagents.agent_first_name": 1,
                        "realestateagents.agent_last_name": 1,
                        "realestateagents.agent_email": 1,
                        "realestateagents.agent_phone": 1,
                    }
                },
            ])

            if (leads) {
                res.status(200).json({ lead: leads });
            }
            else {
                res.status(400).json({ message: "No leads found" });
            }
        }
        else {
            res.status(400).json({ message: "No leads found" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLeadByCompanyUserId = async (req, res) => {
    try {
        const id = req.params.id;
        const isLeadService = await Leads.findOne({ _id: id, service_id: req.user.service_id, company_user_id: req.user.id });

        if (isLeadService) {
            const leads = await Leads.aggregate([
                {
                    $lookup: {
                        from: "leads",
                        localField: "_id",
                        foreignField: "_id",
                        as: "leads"
                    },
                },
                {
                    $lookup: {
                        from: "assets",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "assets"
                    },
                },
                {
                    $lookup: {
                        from: "address_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "address_infos"
                    },
                },
                {
                    $lookup: {
                        from: "military_infos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "military_infos"
                    },
                },
                {
                    $lookup: {
                        from: "loandetails",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "loandetails"
                    },
                },
                {
                    $lookup: {
                        from: "borrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "borrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "coborrower_details",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrower_details"
                    },
                },
                {
                    $lookup: {
                        from: "coborrowerincomes",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "coborrowerincomes"
                    },
                },
                {
                    $lookup: {
                        from: "creditverifications",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "creditverifications"
                    },
                },
                {
                    $lookup: {
                        from: "propertyinfos",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "propertyinfos"
                    },
                },
                {
                    $lookup: {
                        from: "realestateagents",
                        localField: "_id",
                        foreignField: "lead_id",
                        as: "realestateagents"
                    },
                },
                {
                    $project: {
                        "assets.bank": 1,
                        "assets.bank_account_balance": 1,
                        "assets.bank_account_number": 1,
                        "assets.bank_account_type": 1,
                        "address_infos.current_address": 1,
                        "address_infos.years_at_current_address": 1,
                        "address_infos.month_at_current_address": 1,
                        "address_infos.current_monthly_rent_amount": 1,
                        "address_infos.mailing_address": 1,
                        "address_infos.another_former_address": 1,
                        "leads.firstname": 1,
                        "leads.middlename": 1,
                        "leads.lastname": 1,
                        "leads.email": 1,
                        "leads.phone": 1,
                        "leads.martial_status": 1,
                        "leads.suffix": 1,
                        "military_infos.served_in_military": 1,
                        "loandetails.loan_type": 1,
                        "loandetails.property_type": 1,
                        "loandetails.property_use": 1,
                        "loandetails.estimated_value": 1,
                        "loandetails.current_loan_balance": 1,
                        "loandetails.timeFrame": 1,
                        "loandetails.first_time_home_buyer": 1,
                        "loandetails.purchase_price": 1,
                        "loandetails.down_payment": 1,
                        "loandetails.down_payment_amounts": 1,
                        "loandetails.credit_rating": 1,
                        "borrowerincomes.income_type": 1,
                        "borrowerincomes.additional_income": 1,
                        "coborrower_details.is_co_borrower": 1,
                        "coborrower_details.suffix": 1,
                        "coborrower_details.email": 1,
                        "coborrower_details.phone_number": 1,
                        "coborrower_details.martial_status": 1,
                        "coborrower_details.current_address": 1,
                        "coborrower_details.years_at_current_address": 1,
                        "coborrower_details.month_at_current_address": 1,
                        "coborrower_details.current_monthly_rent_amount": 1,
                        "coborrower_details.mailing_address": 1,
                        "coborrowerincomes.income_type": 1,
                        "creditverifications.borrower_ssn": 1,
                        "creditverifications.borrower_dob": 1,
                        "creditverifications.co_borrower_ssn": 1,
                        "creditverifications.co_borrower_dob": 1,
                        "propertyinfos.subject_property_address": 1,
                        "propertyinfos.city": 1,
                        "propertyinfos.state": 1,
                        "propertyinfos.zip": 1,
                        "realestateagents.is_real_estate_agent": 1,
                        "realestateagents.agent_first_name": 1,
                        "realestateagents.agent_last_name": 1,
                        "realestateagents.agent_email": 1,
                        "realestateagents.agent_phone": 1,
                    }
                },
            ])

            if (leads.length > 0) {
                res.status(200).json({ lead: leads.filter(lead => lead._id == id) });
            }
            else {
                res.status(400).json({ message: "No leads found" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const exportLeadsToExcel = async (req, res) => {
    try {
        const service_id = req.user.service_id;
        const leads = await Leads.find({ service_id: service_id }).select("+firstname +lastname +email +phone");
        const assetLeads = leads.map(lead => lead._id);
        const assets = await Assets.find({ lead_id: { $in: assetLeads } }).select("+bank +bank_account_balance +bank_account_number +bank_account_type");
        const address_info = await AddressInfo.find({ lead_id: { $in: assetLeads } }).select("+current_address +years_at_current_address +month_at_current_address +current_monthly_rent_amount +mailing_address +another_former_address");
        const coBorrower = await CoBorrowerDetails.find({ lead_id: { $in: assetLeads } }).select("+is_co_borrower +suffix +email +phone_number +martial_status +current_address +years_at_current_address +month_at_current_address +current_monthly_rent_amount +mailing_address");
        const creditVerification = await Creditverifications.find({ lead_id: { $in: assetLeads } }).select("+borrower_ssn +borrower_dob +co_borrower_ssn +co_borrower_dob");
        const loanDetails = await LoanDetails.find({ lead_id: { $in: assetLeads } }).select("+loan_type +property_type +property_use +estimated_value +current_loan_balance +timeFrame +first_time_home_buyer +purchase_price +down_payment +down_payment_amounts +credit_rating");
        if (leads.length > 0) {
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Leads');
            worksheet.columns = [
                { header: 'First Name', key: 'firstname' },
                { header: 'Last Name', key: 'lastname' },
                { header: 'Email', key: 'email' },
                { header: 'Phone', key: 'phone' },
                { header: 'Status', key: 'status' },
                { header: 'Bank', key: 'bank' },
                { header: 'Bank Account Balance', key: 'bank_account_balance' },
                { header: 'Bank Account Number', key: 'bank_account_number' },
                { header: 'Bank Account Type', key: 'bank_account_type' },
                { header: 'Current Address', key: 'current_address' },
                { header: 'Years at Current Address', key: 'years_at_current_address' },
                { header: 'Month at Current Address', key: 'month_at_current_address' },
                { header: 'Current Monthly Rent Amount', key: 'current_monthly_rent_amount' },
                { header: 'Mailing Address', key: 'mailing_address' },
                { header: 'Another Former Address', key: 'another_former_address' },
                { header: 'Is Co Borrower', key: 'is_co_borrower' },
                { header: 'creditVerification', key: 'creditVerification' },
                { header: 'Loan Details', key: 'loan_details' },
            ];

            leads.forEach((lead) => {
                const asset = assets.find(asset => asset.lead_id.toString() === lead._id.toString());
                const address = address_info.find(address => address.lead_id.toString() === lead._id.toString());
                const coBorrowerDetails = coBorrower.find(coBorrower => coBorrower.lead_id.toString() === lead._id.toString());
                const creditVerifications = creditVerification.find(creditVerification => creditVerification.lead_id.toString() === lead._id.toString());
                const loanDetail = loanDetails.find(loanDetail => loanDetail.lead_id.toString() === lead._id.toString());
                worksheet.addRow({
                    firstname: lead.firstname,
                    lastname: lead.lastname,
                    email: lead.email,
                    phone: lead.phone,
                    status: lead.status,
                    bank: asset?.bank || '',
                    bank_account_balance: asset?.bank_account_balance || '',
                    bank_account_number: asset?.bank_account_number || '',
                    bank_account_type: asset?.bank_account_type || '',
                    current_address: address?.current_address || '',
                    years_at_current_address: address?.years_at_current_address || '',
                    month_at_current_address: address?.month_at_current_address || '',
                    current_monthly_rent_amount: address?.current_monthly_rent_amount || '',
                    mailing_address: address?.mailing_address || '',
                    another_former_address: address?.another_former_address || '',
                    is_co_borrower: {
                        isCoBorrower: coBorrowerDetails?.is_co_borrower ? true : false || '',
                        suffix: coBorrowerDetails?.suffix || '',
                        email: coBorrowerDetails?.email || '',
                        phone_number: coBorrowerDetails?.phone_number || '',
                        martial_status: coBorrowerDetails?.martial_status || '',
                        current_address: coBorrowerDetails?.current_address || '',
                        years_at_current_address: coBorrowerDetails?.years_at_current_address || '',
                        month_at_current_address: coBorrowerDetails?.month_at_current_address || '',
                        current_monthly_rent_amount: coBorrowerDetails?.current_monthly_rent_amount || '',
                        mailing_address: coBorrowerDetails?.mailing_address || '',
                    } || '',
                    creditVerification: {
                        borrower_ssn: creditVerifications?.borrower_ssn || '',
                        borrower_dob: creditVerifications?.borrower_dob || '',
                        co_borrower_ssn: creditVerifications?.co_borrower_ssn || '',
                        co_borrower_dob: creditVerifications?.co_borrower_dob || '',
                    },
                    loan_details: {
                        loan_type: loanDetail?.loan_type || '',
                        property_type: loanDetail?.property_type || '',
                        property_use: loanDetail?.property_use || '',
                        estimated_value: loanDetail?.estimated_value || '',
                        current_loan_balance: loanDetail?.current_loan_balance || '',
                        timeFrame: loanDetail?.timeFrame || '',
                        first_time_home_buyer: loanDetail?.first_time_home_buyer || '',
                        purchase_price: loanDetail?.purchase_price || '',
                        down_payment: loanDetail?.down_payment || '',
                        down_payment_amounts: loanDetail?.down_payment_amounts || '',
                        credit_rating: loanDetail?.credit_rating || '',
                    }
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');
            res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createLead, getLeads, deleteLead, createReferral, getLeadById, addLeadByCompanyUser, getAllLeadsByCompanyUser, getLeadByCompanyUserId, exportLeadsToExcel };