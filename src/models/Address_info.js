const mongoose = require("mongoose")

const AddressInfoSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    current_address:{
        type: String,
        required: true
    },
    years_at_current_address:{
        type: Number,
        required: true
    },
    month_at_current_address:{
        type: String,
        required: true
    },
    current_monthly_rent_amount:{
        type: Number
    },
    mailing_address:{
        type: String,
    },
    another_former_address:{
        type: String,
    }
},{timestamps:true})

module.exports = mongoose.model.AddressInfo || mongoose.model('Address_Info',AddressInfoSchema);