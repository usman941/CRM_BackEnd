const mongoose = require("mongoose")

const LoanDetailsSchema = new mongoose.Schema({
    lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    loan_type: {
        type: String,
        required: true,
        enum: ['Purchase', 'Refinance'],
    },
    property_type: {
        type: String
    },
    property_use: { type: String },
    estimated_value: { type: Number },
    current_loan_balance: { type: Number },
    timeFrame: { type: String },
    first_time_home_buyer: { type: Boolean },
    purchase_price: { type: Number },
    down_payment:{type:String},
    down_payment_amounts:{type:Number},
    credit_rating:{type:String}
}, { timestamps: true })

module.exports = mongoose.model.LoanDetails || mongoose.model('LoanDetails', LoanDetailsSchema);