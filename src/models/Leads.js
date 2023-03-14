const mongoose = require("mongoose")

const LeadSchema = new mongoose.Schema({
    service_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Services",
        required: true
    },
    company_user_id: { 
        type: mongoose.Schema.ObjectId,
        ref: "CompanyUsers",
    },
    firstname: {
        type: String,
        required: [true, "Please add a firstname"]
    },
    lastname: {
        type: String,
        required: [true, "Please add a lastname"]
    },
    middlename: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, "Please add a phone"],
    },
    email: {
        type: String,
        required: [true, "Please add a email"]
    },
    suffix: {
        type: String,
    },
    martial_status:{
        type: String,
    },
    status :{
        type: String,
    },
    documents_required:[
        {
            type: String,
        }
    ]
   
}, { timestamps: true })

module.exports = mongoose.model.Leads || mongoose.model('Leads', LeadSchema);