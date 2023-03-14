const mongoose = require("mongoose")

const CoBorrowerDetailsSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    is_co_borrower:{
        type: Boolean,
        required: true,
        default: false
    },
    suffix:{ type: String},
    email:{type: String},
    phone_number:{type: String},
    martial_status:{type: String},
    current_address:{type: String},
    years_at_current_address:{type: String},
    month_at_current_address:{type: String},
    current_monthly_rent_amount:{type: Number},
    mailing_address:{type: String},
},{timestamps:true})

module.exports = mongoose.model.CoBorrower_Details || mongoose.model('CoBorrower_Details',CoBorrowerDetailsSchema);