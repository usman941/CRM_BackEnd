const mongoose = require("mongoose")

const AttachmentsSchema = new mongoose.Schema({
    lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leads'
    },
    file: {
        type: String,
    },
    file_name: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model.Attachments || mongoose.model('Attachments', AttachmentsSchema);