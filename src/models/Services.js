const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"Users",
        required:true
    },
    subscription_id:{
        type:mongoose.Schema.ObjectId,
        ref:"Subscriptions",
    }
},{timestamps:true})

module.exports = mongoose.model.Services || mongoose.model('Services',ServiceSchema);