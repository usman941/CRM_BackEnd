const mongoose = require("mongoose")

const LoginSessionSchema = new mongoose.Schema({
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services',
    },
    admin_session:[
        {
            ip_address: {type:String},
            user_agent: {type:String},
        }
    ],
    user_session:[
        {
            user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            ip_address: {type:String},
            user_agent: {type:String},
        }
    ],
    referral_session:[
        {
            user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Referrals'},
            ip_address: {type:String},
            user_agent: {type:String},
        }
    ]
},{timestamps:true})

module.exports = mongoose.model.LoginSessions || mongoose.model('LoginSessions',LoginSessionSchema);