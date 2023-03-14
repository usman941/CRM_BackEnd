const Services = require("../models/Services");
const Subscriptions = require("../models/Subscriptions");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SessionAdmin } = require("../helpers/session.config");

const create = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        const isUserExist = await Users.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({ name, email, password: hashPassword });

        if(user)
        {
            const subscription = await Subscriptions.create({ name: "Free", price: 0, duration: 30 });

            if(subscription)
            {
                const service = await Services.create({ user_id: user._id, subscription_id: subscription._id });
                
                if(service)
                {
                    const tokenObj = {
                        id: user._id,
                        name: user.name,
                        service_id: service._id,
                    }
                    const token = jwt.sign(tokenObj, process.env.JWT_SECRET, { expiresIn: "1d" });
                    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    const agent = req.headers['user-agent'];
                    await SessionAdmin(service._id, ip, agent);
                    return res.cookie("msf-token", token, { httpOnly: true }).status(201).json({ message: "User created successfully",token: token  });
                }
                else
                {
                    return res.status(400).json({ message: "Subscription Required" });
                }
            }
            else 
            {
                return res.status(400).json({ message: "Subscription Required" });
            }

        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isUser = await Users.findOne({ email });
        if (!isUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const isActive = await Users.findOne({ email, is_active: true });
        if (!isActive) {
            return res.status(400).json({ message: "User is not active" });
        }
        const isMatch = await bcrypt.compare(password, isUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        else 
        {
            const service = await Services.findOne({ user_id: isUser._id });

            const tokenObj = {
                id: isUser._id,
                name: isUser.name,
                service_id: service._id,
            }
            const token = jwt.sign(tokenObj, process.env.JWT_SECRET, { expiresIn: "1d" });

            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const agent = req.headers['user-agent'];
            await SessionAdmin(service._id, ip, agent);

            return res.cookie("msf-token", token, { httpOnly: true }).status(201).json({ message: "User logged in successfully",token: token });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("msf-token").json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const me = async (req, res) => {
    try
    {
        const user = await Users.findById(req.user.id).select("-password -__v -createdAt -updatedAt")
        if(!user)
        {
            return res.status(400).json({ message: "User not found" });
        }
        else
        {
            return res.status(200).json({ user, service_id: req.user.service_id, });
        }
    }
    catch(error)
    {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { create, login, logout, me };