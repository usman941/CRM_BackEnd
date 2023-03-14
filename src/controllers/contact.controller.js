const emailEvent = require("../helpers/email.config");
const Contacts = require("../models/Contacts");
const CompanyUser = require("../models/CompanyUsers");
const Conversations = require("../models/Conversations");

const createContact = async (req, res) => {
    try {
        const { contact_group } = req.body;
        const { service_id } = req.user;

        const isContact = await Contacts.findOne({ service_id });

        if (isContact) {
            await Contacts.findOneAndUpdate({ service_id }, { $push: { contact_group: contact_group } }, { new: true });
            return res.status(201).json({ message: "Contact created successfully" })
        }
        else {
            const contact = await Contacts.create({
                service_id,
                contact_group
            });

            if (contact) {
                res.status(201).json({ message: "Contact created successfully" })
            }
            else {
                res.status(400).json({ message: "Contact not created" })
            }
        }


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getContacts = async (req, res) => {
    try {
        const { service_id } = req.user;
        const contacts = await Contacts.find({ service_id }).populate({
            path: 'contact_group.contacts',
            select: 'name email phone_number'
        }).select("-service_id -__v -createdAt -updatedAt");
        if (contacts.length > 0) {
            res.status(200).json({ contacts });
        }
        else {
            res.status(400).json({ message: "No contacts found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteContact = async (req, res) => {
    try {
        const { contact_id } = req.params;
        const { service_id } = req.user;

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const messageToContactGroup = async (req, res) => {
    try {
        const { contact_group_id } = req.params;
        const { service_id } = req.user;
        const { message, subject, type } = req.body;

        const getAllContactIds = await Contacts.findOne({ service_id }).populate({
            path: 'contact_group.contacts',
            select: 'name email phone_number'
        }).select("-service_id -__v -createdAt -updatedAt");

        const contactGroup = getAllContactIds.contact_group.find(group => group._id == contact_group_id);

        const contactIds = contactGroup.contacts.map(contact => contact._id);

        if (type === 'email') {
            contactIds.forEach(async (contactId) => {
                const userEmail = await CompanyUser.findOne({ _id: contactId }).select("email");
                const sendEmail = await emailEvent(userEmail.email, subject, message);
                if (sendEmail) {
                    const conversation = await Conversations.create({
                        service_id: req.user.service_id,
                        message_type: 'email',
                        message: {
                            recipient: userEmail.email,
                            subject: subject,
                            message: message
                        },
                        status: 'sent'

                    });

                    if (conversation) {
                        console.log("Email sent");
                    }
                }
                else {
                    const conversation = await Conversations.create({
                        service_id: req.user.service_id,
                        message_type: 'email',
                        message: {
                            recipient: userEmail.email,
                            subject: subject,
                            message: message
                        },
                        status: 'failed'
                    });

                    if (conversation) {
                        console.log("Email not sent");
                    }
                }
            });
        }

        res.json({ message: "Message sent successfully" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createContact, getContacts, messageToContactGroup }