const mongoose = require("mongoose")

const MilitaryInfoSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    served_in_military:{
        type: Boolean,
        required: true,
        default: false
    }
},{timestamps:true})

module.exports = mongoose.model.Military_Info || mongoose.model('Military_Info',MilitaryInfoSchema);