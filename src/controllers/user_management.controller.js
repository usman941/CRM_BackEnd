const CompanyUsers = require("../models/CompanyUsers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SessionUser } = require("../helpers/session.config");

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const isEmail = await CompanyUsers.findOne({ email });

        if (isEmail) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await CompanyUsers.create({
            service_id: req.user.service_id,
            name,
            email,
            password: hashedPassword,
            role,
        })

        res.status(201).json({ message: "User created successfully", user })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { role, name, email, password, is_active } = req.body;
        const { id } = req.params;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updated = await CompanyUsers.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                name,
                email,
                password: hashedPassword,
                is_active,
                role
            }
        })

        if (updated) {
            res.status(200).json({ message: "User updated successfully" })
        }
        else {
            res.status(400).json({ message: "User not found" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUsers = async (req, res) => {
    try {
        let query;
        if (req.query.id) {
            query = CompanyUsers.findById({ _id: req.query.id });
        }
        else {
            query = CompanyUsers.find({ service_id: req.user.service_id });
        }
        const users = await query.select("-password -__v -createdAt -updatedAt -service_id");
        if(users.length === 0){
            res.status(200).json({message:"No users found"})
        }
        else{
            res.status(200).json({users})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password, service_id } = req.body;
        const isExist = await CompanyUsers.findOne({ email, service_id });
        if (!isExist) return res.status(400).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, isExist.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: isExist._id, role: isExist.role, service_id:service_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const agent = req.headers['user-agent'];
        await SessionUser(service_id, isExist._id,ip,agent);
        res.cookie("msf-companyUser", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const profile = async (req, res) => {
    try {
        const user = req.user.id;
        const userDetail = await CompanyUsers.findById(user).select("-password -__v -createdAt -updatedAt -service_id");
        res.status(200).json({ userDetail})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("msf-companyUser");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createUser, updateUser, getUsers, loginUser, profile, logoutUser }