const mongoose = require("mongoose")

const ContactSchema = new mongoose.Schema({
    service_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'services',
    },
    contact_group:[
        {
            group_name:{
                type:String,
                required:true,
            },
            contacts:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'CompanyUsers'
                }
            ]
        }
    ]
},{timestamps:true})

module.exports = mongoose.model.Contacts || mongoose.model('Contacts',ContactSchema);