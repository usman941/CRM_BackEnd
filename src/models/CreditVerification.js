const mongoose = require("mongoose")

const CreditVerificationSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    borrower_ssn:{ type: String },
    borrower_dob:{ type: String },
    co_borrower_ssn:{ type: String },
    co_borrower_dob:{ type: String },
    agreed:{ type: Boolean },
    
},{timestamps:true})

module.exports = mongoose.model.CreditVerifications || mongoose.model('CreditVerifications',CreditVerificationSchema);