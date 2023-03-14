const mongoose = require("mongoose")

const CompanyUserSchema = new mongoose.Schema({
    service_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Services",
    },
    name:{
        type:String,
        required:[true,"Please provide a name"],
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please provide a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        minlength:6
    },
    role:{
        type:String,
        enum:["loan_officer","loan_processor"],
        default:"loan_officer"
    },
    is_active:{
        type:Boolean,
        default:true
    },
},{timestamps:true})

module.exports = mongoose.model.CompanyUsers || mongoose.model('CompanyUsers',CompanyUserSchema);