const LoginSessions = require('../models/LoginSessions')

const SessionAdmin = async (service_id, ip, agent) => {
    try {
        const isExist = await LoginSessions.findOne({ service_id });
        if (isExist) {
            const session = await LoginSessions.findOneAndUpdate({ service_id }, { $push: { admin_session: { ip_address: ip, user_agent: agent } } }, { new: true });
            if (session) {
                return true;
            }
        }
        else {
            const session = await LoginSessions.create({
                service_id: service_id,
                admin_session: [
                    {
                        ip_address: ip,
                        user_agent: agent,
                    }
                ],
            });

            if (session) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
}

const SessionUser = async (service_id, user_id, ip, agent) => {
    try {
        const isExist = await LoginSessions.findOne({ service_id });
        if (isExist) {
            const session = await LoginSessions.findOneAndUpdate({ service_id }, { $push: { user_session: { user_id: user_id, ip_address: ip, user_agent: agent } } }, { new: true });
            if (session) {
                return true;
            }
        }
        else {
            const session = await LoginSessions.create({
                service_id: service_id,
                user_session: [
                    {
                        user_id: user_id,
                        ip_address: ip,
                        user_agent: agent,
                    }
                ],
            });

            if (session) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
}

const SessionReferral = async (service_id, user_id, ip, agent) => {
    try {
        const isExist = await LoginSessions.findOne({ service_id });
        if (isExist) {
            const session = await LoginSessions.findOneAndUpdate({ service_id }, { $push: { referral_session: { user_id: user_id, ip_address: ip, user_agent: agent } } }, { new: true });
            if (session) {
                return true;
            }
        }
        else {
            const session = await LoginSessions.create({
                service_id: service_id,
                referral_session: [
                    {
                        user_id: user_id,
                        ip_address: ip,
                        user_agent: agent,
                    }
                ],
            });

            if (session) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
}

module.exports = { SessionAdmin, SessionUser, SessionReferral }