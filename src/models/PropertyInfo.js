const mongoose = require("mongoose")

const PropertyInfoSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    subject_property_address:{ type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    
},{timestamps:true})

module.exports = mongoose.model.PropertyInfos || mongoose.model('PropertyInfos',PropertyInfoSchema);