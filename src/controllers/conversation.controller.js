const emailEvent = require("../helpers/email.config");
const sendSms = require("../helpers/sms.config");
const {  } = require("../helpers/sms.config");
const Conversations = require("../models/Conversations");

const messageByEmail = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        const response = await emailEvent(email, subject, message);
        if (response) {
            const conversation = new Conversations({
                service_id: req.user.service_id,
                message_type: 'email',
                message: {
                    recipient: email,
                    subject: subject,
                    message: message
                },
                status: 'sent'
            });

            const savedConversation = await conversation.save();

            if (savedConversation) {
                res.status(200).json({ message: 'Message sent successfully' });
            }
            else {
                res.status(500).json({ message: 'Message sent but error in saving conversation' });
            }
        }
        else {
            const conversation = new Conversations({
                service_id: req.user.service_id,
                message_type: 'email',
                message: {
                    recipient: email,
                    subject: subject,
                    message: message
                },
                status: 'failed'
            });

            const savedConversation = await conversation.save();

            if (savedConversation) {
                res.status(200).json({ message: 'Message failed, Please try again...' });
            }
            else {
                res.status(500).json({ message: 'Message sent but error saving conversation' });
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const messageBySMS = async (req, res) => {
    try {
        const resp = await sendSms();
        res.status(200).json({ message: 'Message sent successfully' });
        console.log(resp);
        // let to = req.body.to;
        // let message = req.body.message;
        // await login();
        // let resp = await sendMessage(to, message);
        // if (resp.status > 400) {
        //     res.status(500).send('failed');
        //     return;
        // }
        // res.status(resp.status).send('Done!');
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const getAllConversations = async (req, res) => {
    try {
        const { service_id } = req.user;
        const conversations = await Conversations.find({ service_id }).select("-service_id -__v -createdAt -updatedAt");
        if(conversations.length > 0) {
            res.status(200).json({ conversations });
        }
        else {
            res.status(404).json({ message: 'No conversation found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { messageByEmail, messageBySMS, getAllConversations };