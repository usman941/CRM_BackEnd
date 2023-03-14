const mongoose = require("mongoose")

const SubscriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"],
        enum: ["Free", "Basic", "Premium"],
    },
    price:{
        type:Number,
        required:[true,"Please provide a price"],
    },
    duration:{
        type:Number,
        required:[true,"Please provide a duration"],
    },
},{timestamps:true})

module.exports = mongoose.model.Subscriptions || mongoose.model('Subscriptions',SubscriptionSchema);