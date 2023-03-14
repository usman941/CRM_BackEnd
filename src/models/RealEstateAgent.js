const mongoose = require("mongoose")

const RealEstateAgentSchema = new mongoose.Schema({
    lead_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    is_real_estate_agent:{
        type: Boolean,
        required: true,
        default: false
    },
    agent_first_name:{ type: String },
    agent_last_name:{ type: String },
    agent_email:{ type: String },
    agent_phone:{ type: String },
    
},{timestamps:true})

module.exports = mongoose.model.RealEstateAgents || mongoose.model('RealEstateAgents',RealEstateAgentSchema);