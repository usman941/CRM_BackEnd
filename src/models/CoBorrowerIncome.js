const mongoose = require("mongoose")

const CoBorrowerIncomeSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    income_type:{ type: String },
    additional_income:{ type: Boolean },
    
},{timestamps:true})

module.exports = mongoose.model.CoBorrowerIncomes || mongoose.model('CoBorrowerIncomes',CoBorrowerIncomeSchema);