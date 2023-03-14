const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
   title:{
        type:String,
        required:true
   },
   description:{
        type:String,
        required:true
   },
   deadline:{
        type:Date,
        required:true
   },
   service_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required:true
    },
    assigned_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    assigned_to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CompanyUsers',
        required:true
    },
    status:{
        type:String,
        enum:['pending','completed'],
        default:'pending'
    }
},{timestamps:true})

module.exports = mongoose.model.Tasks || mongoose.model('Tasks',TaskSchema);