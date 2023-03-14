const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
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
        enum:["superadmin","admin"],
        default:"admin"
    },
    is_active:{
        type:Boolean,
        default:true
    },
},{timestamps:true})

module.exports = mongoose.model.Users || mongoose.model('Users',UserSchema);