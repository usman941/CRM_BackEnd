const jwt = require('jsonwebtoken');
const Referrals = require('../models/Referral');
const Leads = require('../models/Leads');
const bcrypt = require('bcryptjs');
const Address_info = require('../models/Address_info');
const CoBorrower_Details = require('../models/CoBorrower_Details');
const Military_info = require('../models/Military_info');
const Loan_details = require('../models/Loan_details');
const RealEstateAgent = require('../models/RealEstateAgent');
const PropertyInfo = require('../models/PropertyInfo');
const CreditVerification = require('../models/CreditVerification');
const BorrowerIncome = require('../models/BorrowerIncome');
const CoBorrowerIncome = require('../models/CoBorrowerIncome');
const Assets = require('../models/Assets');
const upload = require('../helpers/multer.config');
const multer = require('multer');
const Attachments = require('../models/Attachments');
const { SessionReferral } = require('../helpers/session.config');
const emailEvent = require('../helpers/email.config');

const index = (req, res) => {
    const token = req.params.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (decode) {
        res.render('index', { decode, message: '' });
    }
}

const register = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password, property, lead_id } = req.body;
        const referral = await Referrals.findOne({ lead_id: lead_id });
        if (referral.referral_status === 'pending') {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await Referrals.findByIdAndUpdate({ _id: referral._id }, {
                $set: {
                    firstname,
                    lastname,
                    phone,
                    email,
                    password: hashPassword,
                    property,
                    referral_status: 'accepted'
                }
            });

            if (user) {
                const refId = referral._id;
                const token = jwt.sign({ refId }, process.env.JWT_SECRET, { expiresIn: "2h" });

                const message = `
                    You have been registered successfully. Please use this login url to login to your account.
                    ${process.env.REF_URL}/portal/login/${refId}
                `;

                await emailEvent(email, 'Login Details', message);

                res.cookie('refToken', token, { httpOnly: true }).redirect('/portal/dashboard/application?form=1');

            } else {
                res.render('index', {
                    message: 'Registration failed',
                    decode: ''
                });
            }
        } else {
            res.render('index', {
                message: 'Already registered. Please login',
                decode: ''
            });
        }

    } catch (error) {
        res.render('index', {
            message: error.message,
            decode: ''
        });
    }
}

const login = (req, res) => {
    try {
        if (req.cookies["refToken"]) {
            res.redirect('/portal/dashboard/application?form=1');
        } else {
            const ref = req.params.ref;
            res.render('login', { message: '', ref: ref });
        }
    } catch (error) {
        res.render('index', { message: error.message, decode: '' });
    }
}

const loginPost = async (req, res) => {
    try {
        const { email, password, ref } = req.body;
        const isRef = await Referrals.findById({ _id: ref });
        if (isRef) {
            const isEmail = await Referrals.findOne({ email: email, _id: ref });
            if (isEmail) {
                const isPassword = await bcrypt.compare(password, isEmail.password);
                if (isPassword) {
                    const refId = isEmail._id;
                    const token = jwt.sign({ refId }, process.env.JWT_SECRET, { expiresIn: "2h" });
                    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    const agent = req.headers['user-agent'];
                    await SessionReferral(isEmail.service_id, isEmail._id, ip, agent)
                    res.cookie('refToken', token, { httpOnly: true }).redirect('/portal/dashboard/application?form=1');
                } else {
                    res.render('login', { message: 'Invalid credentials', ref: ref });
                }
            } else {
                res.render('login', { message: 'Invalid credentials', ref: ref });
            }
        }
        else 
        {
            res.render('login', { message: 'Invalid credentials', ref: ref });
        }

    } catch (error) {
        res.render('login', { message: error.message });
    }
}

const dashboard = async (req, res) => {
    const refId = req.ref.refId;
    const referral = await Referrals.findById({ _id: refId }).select('-password -__v -referral_status -referral_token -property -createdAt -updatedAt ');
    if (req.query.form === '1') {
        if (referral) {
            const lead = await Leads.findById({ _id: referral.lead_id }).select('-__v -createdAt -updatedAt');
            if (lead) {
                res.render('dashboard', { lead, method: 'PUT' });
            }
        }
    }
    if (req.query.form === '2') {
        const address_info = await Address_info.findOne({
            lead_id: referral.lead_id
        }).select('-__v -createdAt -updatedAt');
        if (address_info) {
            res.render('address_info', { address_info, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('address_info', { address_info: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '3') {
        const coBorrower_details = await CoBorrower_Details.findOne({
            lead_id: referral.lead_id
        });
        if (coBorrower_details) {
            res.render('co_borrower_details', { coBorrower_details, lead: referral.lead_id, method: 'PUT' });
        }
        res.render('co_borrower_details', { coBorrower_details: '', lead: referral.lead_id, method: 'POST' });
    }
    if (req.query.form === '4') {
        const military_info = await Military_info.findOne({ lead_id: referral.lead_id });
        if (military_info) {
            res.render('military_details', { military_info, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('military_details', { military_info: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '5') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });
        if (loanDetails) {
            res.render('loan_type', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('loan_type', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '6') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('property_type', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('property_type', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '7') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('property_use', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('property_use', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '8') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('estimated_value', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('estimated_value', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '9') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('current_loan_balance', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('current_loan_balance', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '10') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('timeframe', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('timeframe', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '11') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('first_time_home_buyer', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('first_time_home_buyer', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '12') {

        const realEstateAgent = await RealEstateAgent.findOne({ lead_id: referral.lead_id });

        if (realEstateAgent) {
            res.render('real_estate', { realEstateAgent, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('real_estate', { realEstateAgent: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '13') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('purchase_price', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('purchase_price', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '14') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('down_payment', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('down_payment', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '15') {
        const loanDetails = await Loan_details.findOne({ lead_id: referral.lead_id });

        if (loanDetails) {
            res.render('credit_rating', { loanDetails, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('credit_rating', { loanDetails: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '16') {
        const property = await PropertyInfo.findOne({ lead_id: referral.lead_id });

        if (property) {
            res.render('tell_us_about_your_property', { property, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('tell_us_about_your_property', { property: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '17') {
        const credit = await CreditVerification.findOne({ lead_id: referral.lead_id });

        if (credit) {
            res.render('credit_verification', { credit, lead: referral.lead_id, method: 'PUT', message: '' });
        }
        else {
            res.render('credit_verification', { credit: '', lead: referral.lead_id, method: 'POST', message: '' });
        }
    }
    if (req.query.form === '18') {
        const borrowerIncome = await BorrowerIncome.findOne({ lead_id: referral.lead_id });

        if (borrowerIncome) {
            res.render('borrower_income', { borrowerIncome, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('borrower_income', { borrowerIncome: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '19') {
        const borrowerIncome = await BorrowerIncome.findOne({ lead_id: referral.lead_id });

        if (borrowerIncome) {
            res.render('additional_income', { borrowerIncome, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('additional_income', { borrowerIncome: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '20') {
        const borrowerIncome = await CoBorrowerIncome.findOne({ lead_id: referral.lead_id });

        if (borrowerIncome) {
            res.render('co_borrower_income', { borrowerIncome, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('co_borrower_income', { borrowerIncome: '', lead: referral.lead_id, method: 'POST' });
        }
    }
    if (req.query.form === '21') {
        const assets = await Assets.findOne({ lead_id: referral.lead_id });
        if (assets) {
            res.render('assets', { assets, lead: referral.lead_id, method: 'PUT' });
        }
        else {
            res.render('assets', { assets: '', lead: referral.lead_id, method: 'POST' });
        }
    }

    if (req.query.form === 'completion') {
        res.render('completion');
    }
}

const dashboardAction = async (req, res) => {
    try {
        if (req.params.id) {
            if (req.query.form === '1') {
                const { firstname, lastname, middlename, email, suffix, phone_number, martial } = req.body;
                const updateLead = await Leads.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        firstname,
                        lastname,
                        middlename,
                        email,
                        suffix,
                        phone_number,
                        martial_status: martial
                    }
                });

                if (updateLead) {
                    res.redirect('/portal/dashboard/application?form=2');
                }
                else {
                    res.render('dashboard', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '2') {
                const {
                    current_address,
                    years_at_current_address,
                    month_at_current_address,
                    current_monthly_rent_amount,
                    mailing_address,
                    another_former_address
                } = req.body;

                const updateAddress = await Address_info.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        current_address,
                        years_at_current_address,
                        month_at_current_address,
                        current_monthly_rent_amount,
                        mailing_address,
                        another_former_address
                    }
                });

                if (updateAddress) {
                    res.redirect('/portal/dashboard/application?form=3');
                }
                else {
                    res.render('address_info', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '3') {
                const {
                    is_co_borrower_details,
                    suffix,
                    email,
                    phone_number,
                    martial_status,
                    current_address,
                    years_at_current_address,
                    month_at_current_address,
                    current_monthly_rent_amount,
                    mailing_address
                } = req.body;

                if (is_co_borrower_details === 'yes') {
                    const updateCoBorrower = await CoBorrower_Details.findByIdAndUpdate({ _id: req.params.id }, {
                        $set: {
                            is_co_borrower: true,
                            suffix,
                            email,
                            phone_number,
                            martial_status,
                            current_address,
                            years_at_current_address,
                            month_at_current_address,
                            current_monthly_rent_amount,
                            mailing_address
                        }
                    });

                    if (updateCoBorrower) {
                        res.redirect('/portal/dashboard/application?form=4');
                    }
                    else {
                        res.render('co_borrower_details', { message: 'Update failed', method: 'PUT' });
                    }
                }
                else if (is_co_borrower_details === 'no') {
                    const updateCoBorrower = await CoBorrower_Details.findByIdAndUpdate({ _id: req.params.id }, {
                        $set: {
                            is_co_borrower: false,
                            suffix: "",
                            email: "",
                            phone_number: "",
                            martial_status: "",
                            current_address: "",
                            years_at_current_address: "",
                            month_at_current_address: "",
                            current_monthly_rent_amount: "",
                            mailing_address: ""
                        }
                    });

                    if (updateCoBorrower) {
                        res.redirect('/portal/dashboard/application?form=4');
                    }
                    else {
                        res.render('co_borrower_details', { message: 'Update failed', method: 'PUT' });
                    }
                }

            }
            else if (req.query.form === '4') {
                const { is_military } = req.body;
                const updateMilitary = await Military_info.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        served_in_military: is_military === 'yes' ? true : false
                    }
                });

                if (updateMilitary) {
                    res.redirect('/portal/dashboard/application?form=5');
                }
                else {
                    res.render('military_service', { message: 'Update failed', method: 'PUT' });
                }

            }
            else if (req.query.form === '5') {
                const { is_loan_type } = req.body;
                const updateLoanType = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        loan_type: is_loan_type
                    }
                });

                if (updateLoanType) {
                    res.redirect('/portal/dashboard/application?form=6');
                }
                else {
                    res.render('loan_type', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '6') {
                const { is_property_type } = req.body;
                const updatePropertyType = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        property_type: is_property_type
                    }
                });

                if (updatePropertyType) {
                    res.redirect('/portal/dashboard/application?form=7');
                }
                else {
                    res.render('property_type', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '7') {
                const { is_property_use } = req.body;
                const updatePropertyUse = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        property_use: is_property_use
                    }
                });

                if (updatePropertyUse) {
                    res.redirect('/portal/dashboard/application?form=8');
                }
                else {
                    res.render('property_use', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '8') {
                const { estimate_value } = req.body;
                const updatePropertyUse = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        estimated_value: estimate_value
                    }
                });

                if (updatePropertyUse) {
                    res.redirect('/portal/dashboard/application?form=9');
                }
                else {
                    res.render('property_use', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '9') {
                const { current_loan_balance } = req.body;

                const updatePropertyUse = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        current_loan_balance: current_loan_balance
                    }
                });

                if (updatePropertyUse) {
                    res.redirect('/portal/dashboard/application?form=10');
                }
                else {
                    res.render('property_use', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '10') {
                const { timeFrame } = req.body;
                const updatePropertyUse = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        timeFrame: timeFrame
                    }
                });

                if (updatePropertyUse) {
                    res.redirect('/portal/dashboard/application?form=11');
                }
                else {
                    res.render('property_use', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '11') {
                const { is_home } = req.body;
                const updateHome = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        first_time_home_buyer: is_home === 'yes' ? true : false
                    }
                });

                if (updateHome) {
                    res.redirect('/portal/dashboard/application?form=12');
                }
                else {
                    res.render('first_time_home_buyer', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '12') {
                const {
                    is_real_estate_agent,
                    agent_first_name,
                    agent_last_name,
                    agent_email,
                    agent_phone,
                } = req.body;

                const updateAgent = await RealEstateAgent.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        is_real_estate_agent: is_real_estate_agent === 'yes' ? true : false,
                        agent_first_name,
                        agent_last_name,
                        agent_email,
                        agent_phone
                    }
                });

                if (updateAgent) {
                    res.redirect('/portal/dashboard/application?form=13');
                }
                else {
                    res.render('real_estate_agent', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '13') {
                const { purchase_price } = req.body;

                const updateLoanDetails = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        purchase_price
                    }
                })

                if (updateLoanDetails) {
                    res.redirect('/portal/dashboard/application?form=14');
                }
                else {
                    res.render('purchase_price', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '14') {
                const { down_payment, down_payment_amounts } = req.body;

                const updateLoanDetails = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        down_payment,
                        down_payment_amounts
                    }
                })

                if (updateLoanDetails) {
                    res.redirect('/portal/dashboard/application?form=15');
                }
                else {
                    res.render('down_payment', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '15') {
                const { credit_rating } = req.body;
                const updateLoanDetails = await Loan_details.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        credit_rating
                    }
                })

                if (updateLoanDetails) {
                    res.redirect('/portal/dashboard/application?form=16');
                }
                else {
                    res.render('credit_rating', { message: 'Update failed', method: 'PUT' });
                }
            }
            else if (req.query.form === '16') {
                const {
                    subject_property_address,
                    city,
                    state,
                    zip,
                    lead_id
                } = req.body;

                const updateProperty = await PropertyInfo.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        subject_property_address,
                        city,
                        state,
                        zip
                    }
                });

                if (updateProperty) {
                    res.redirect('/portal/dashboard/application?form=17');
                }
                else {
                    res.render('property_info', { message: 'Update failed', method: 'POST', lead: lead_id });
                }

            }
            else if (req.query.form === '17') {
                const {
                    borrower_ssn,
                    borrower_dob,
                    co_borrower_ssn,
                    co_borrower_dob,
                    lead_id,
                    agreed
                } = req.body;

                if (agreed) {
                    const updated = await CreditVerification.findByIdAndUpdate({ _id: req.params.id }, {
                        $set: {
                            borrower_ssn,
                            borrower_dob,
                            co_borrower_ssn,
                            co_borrower_dob,
                            agreed: agreed ? true : false
                        }
                    });

                    if (updated) {
                        res.redirect('/portal/dashboard/application?form=18');
                    }
                    else {
                        res.render('credit_verification', { message: 'Update failed', method: 'POST', lead: lead_id });
                    }
                }
                else {
                    res.render('credit_verification', { message: 'You must agree to the terms', method: 'POST', lead: lead_id, credit: "" });
                }
            }
            else if (req.query.form === '18') {
                const {
                    lead_id,
                    income_type
                } = req.body

                const updateIncome = await BorrowerIncome.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        income_type
                    }
                });

                if (updateIncome) {
                    res.redirect('/portal/dashboard/application?form=19');
                }
                else {
                    res.render('borrower_income', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
            else if (req.query.form === '19') {
                const { additional_income } = req.body;

                const updateIncome = await BorrowerIncome.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        additional_income
                    }
                });

                if (updateIncome) {
                    res.redirect('/portal/dashboard/application?form=20');
                }
                else {
                    res.render('additional_income', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
            else if (req.query.form === '20') {
                const {
                    lead_id,
                    income_type
                } = req.body

                const updateIncome = await CoBorrowerIncome.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        income_type
                    }
                });

                if (updateIncome) {
                    res.redirect('/portal/dashboard/application?form=21');
                }
                else {
                    res.render('co_borrower_income', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }

            else if (req.query.form === '21') {
                const {
                    lead_id,
                    is_asset_type,
                    bank_account_type,
                    bank_account_number,
                    bank_account_balance
                } = req.body;

                const updateAsset = await Asset.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        bank: is_asset_type,
                        bank_account_type,
                        bank_account_number,
                        bank_account_balance
                    }
                });

                if (updateAsset) {
                    res.redirect('/portal/dashboard/application?form=completion');
                }
                else {
                    res.render('asset', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
        }
        else {
            if (req.query.form === '2') {
                const {
                    lead_id,
                    current_address,
                    years_at_current_address,
                    month_at_current_address,
                    current_monthly_rent_amount,
                    mailing_address,
                    another_former_address
                } = req.body;

                const address_info = new Address_info({
                    lead_id: lead_id,
                    current_address,
                    years_at_current_address,
                    month_at_current_address,
                    current_monthly_rent_amount,
                    mailing_address,
                    another_former_address
                });

                const saveAddress = await address_info.save();

                if (saveAddress) {
                    res.redirect('/portal/dashboard/application?form=3');
                }
                else {
                    res.render('address_info', { message: 'Update failed', method: 'POST', address_info: '', lead: lead_id });
                }
            }
            else if (req.query.form === '3') {
                const {
                    is_co_borrower_details,
                    suffix,
                    email,
                    phone_number,
                    martial_status,
                    current_address,
                    years_at_current_address,
                    month_at_current_address,
                    current_monthly_rent_amount,
                    mailing_address
                } = req.body;

                if (is_co_borrower_details === 'yes') {
                    const co_borrower_details = CoBorrower_Details.create({
                        lead_id: req.body.lead_id,
                        is_co_borrower: true,
                        suffix,
                        email,
                        phone_number,
                        martial_status,
                        current_address,
                        years_at_current_address,
                        month_at_current_address,
                        current_monthly_rent_amount,
                        mailing_address
                    })

                    if (co_borrower_details) {
                        res.redirect('/portal/dashboard/application?form=4');
                    }
                    else {
                        res.render('co_borrower_details', { message: 'Update failed', method: 'POST', lead: req.body.lead_id });
                    }
                }
                else if (is_co_borrower_details === 'no') {
                    const co_borrower_details = CoBorrower_Details.create({
                        lead_id: req.body.lead_id,
                        is_co_borrower: false,
                    })

                    if (co_borrower_details) {
                        res.redirect('/portal/dashboard/application?form=4');
                    }
                    else {
                        res.render('co_borrower_details', { message: 'Update failed', method: 'POST', lead: req.body.lead_id });
                    }

                }
            }
            else if (req.query.form === '4') {
                const { is_military } = req.body;
                const military = await Military_info.create({
                    lead_id: req.body.lead_id,
                    served_in_military: is_military === 'yes' ? true : false
                })

                if (military) {
                    res.redirect('/portal/dashboard/application?form=5');
                }
                else {
                    res.render('military_info', { message: 'Update failed', method: 'POST', lead: req.body.lead_id });
                }
            }
            else if (req.query.form === '5') {
                const { is_loan_type } = req.body;
                const loan_type = await Loan_details.create({
                    lead_id: req.body.lead_id,
                    loan_type: is_loan_type
                })

                if (loan_type) {
                    res.redirect('/portal/dashboard/application?form=6');
                }
                else {
                    res.render('loan_type', { message: 'Update failed', method: 'POST', lead: req.body.lead_id });
                }
            }
            else if (req.query.form === '12') {
                const {
                    is_real_estate_agent,
                    lead_id,
                    agent_first_name,
                    agent_last_name,
                    agent_email,
                    agent_phone,
                } = req.body;

                const real_estate_agent = await RealEstateAgent.create({
                    lead_id: lead_id,
                    is_real_estate_agent: is_real_estate_agent === 'yes' ? true : false,
                    agent_first_name,
                    agent_last_name,
                    agent_email,
                    agent_phone
                })

                if (real_estate_agent) {
                    res.redirect('/portal/dashboard/application?form=13');
                }
                else {
                    res.render('real_estate_agent', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
            else if (req.query.form === '16') {
                const {
                    subject_property_address,
                    city,
                    state,
                    zip,
                    lead_id
                } = req.body;

                const property_info = await PropertyInfo.create({
                    lead_id: lead_id,
                    subject_property_address,
                    city,
                    state,
                    zip
                });

                if (property_info) {
                    res.redirect('/portal/dashboard/application?form=17');
                }
                else {
                    res.render('property_info', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
            else if (req.query.form === '17') {
                const {
                    borrower_ssn,
                    borrower_dob,
                    co_borrower_ssn,
                    co_borrower_dob,
                    lead_id,
                    agreed
                } = req.body;

                if (agreed) {
                    const credit = await CreditVerification.create({
                        lead_id: lead_id,
                        borrower_ssn,
                        borrower_dob,
                        co_borrower_ssn,
                        co_borrower_dob,
                        agreed: agreed ? true : false
                    });

                    if (credit) {
                        res.redirect('/portal/dashboard/application?form=18');
                    }
                    else {
                        res.render('credit_verification', { message: 'Update failed', method: 'POST', lead: lead_id });
                    }
                }
                else {
                    res.render('credit_verification', { message: 'Please agree to the terms and conditions', method: 'POST', lead: lead_id, credit: '' });
                }

            }
            else if (req.query.form === '18') {
                const {
                    lead_id,
                    income_type
                } = req.body

                const borrower_income = await BorrowerIncome.create({
                    lead_id: lead_id,
                    income_type
                });

                if (borrower_income) {
                    res.redirect('/portal/dashboard/application?form=19');
                }
                else {
                    res.render('borrower_income', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
            else if (req.query.form === '20') {
                const {
                    lead_id,
                    income_type
                } = req.body

                console.log(req.body);

                const borrower_income = await CoBorrowerIncome.create({
                    lead_id: lead_id,
                    income_type
                });

                if (borrower_income) {
                    res.redirect('/portal/dashboard/application?form=21');
                }
                else {
                    console.log('failed');
                    res.render('co_borrower_income', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
            else if (req.query.form === '21') {
                const {
                    lead_id,
                    is_asset_type,
                    bank_account_type,
                    bank_account_number,
                    bank_account_balance
                } = req.body;

                const assets = await Assets.create({
                    lead_id: lead_id,
                    bank: is_asset_type,
                    bank_account_type,
                    bank_account_number,
                    bank_account_balance
                });

                if (assets) {
                    res.redirect('/portal/dashboard/application?form=completion');
                }
                else {
                    res.render('assets', { message: 'Update failed', method: 'POST', lead: lead_id });
                }
            }
        }

    } catch (error) {
        console.log(error);
        res.render('dashboard', { message: error.message, method: 'PUT', lead: '' });
    }
}

const logout = (req, res) => {
    res.clearCookie('refToken');
    res.redirect('/portal/login/unauthorized');
}

const documentUpload = async (req, res) => {
    const refId = req.ref.refId;
    const referral = await Referrals.findById({ _id: refId }).select('-password -__v -referral_status -referral_token -property -createdAt -updatedAt ');
    const lead = await Leads.findById({ _id: referral.lead_id });
    const attachments = await Attachments.find({ lead_id: lead._id }).select('-lead_id -__v -createdAt -updatedAt');
    res.render('documents', { lead, attachments });
};

const documentUploadPost = async (req, res) => {
    try {
        upload.single("image")(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                res.status(422).json({ error: err.message });
            } else if (err) {
                res.status(422).json({ error: err.message });
            } else {
                const { lead_id, document_type } = req.body;
                const image = req.file.filename;

                const document = await Attachments.create({
                    lead_id: lead_id,
                    file: document_type,
                    file_name: image
                });

                if (document) {
                    res.redirect('/portal/dashboard/documents');
                }
                else {
                    res.render('documents', { lead: lead_id, attachments: '' });
                }

            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { index, login, register, dashboard, logout, loginPost, dashboardAction, documentUpload, documentUploadPost }