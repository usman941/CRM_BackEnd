const mongoose = require("mongoose")

const AssetsSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    bank:{type: String},
    bank_account_balance:{type: Number},
    bank_account_type:{type: String},
    bank_account_number:{type: String},
},{timestamps:true})

module.exports = mongoose.model.Assets || mongoose.model('Assets',AssetsSchema);