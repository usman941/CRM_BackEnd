const mongoose = require("mongoose")

const ReferralSchema = new mongoose.Schema({
    ref_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Leads' },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    property: { type: String },
    password: { type: String  },
    referral_token: { type: String, required: true },
    referral_status: { 
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
     },
}, { timestamps: true })

module.exports = mongoose.model.Referrals || mongoose.model('Referrals', ReferralSchema);