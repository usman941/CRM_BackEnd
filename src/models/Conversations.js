const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services',
    },
    message_type: {
        type: String,
        enum: ['email', 'sms', 'in_app'],
        required: true
    },
    message: {
        recipient: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model.Conversations || mongoose.model('Conversations', ConversationSchema);