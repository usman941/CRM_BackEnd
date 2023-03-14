const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { title, description, deadline, assigned_to } = req.body;
        const task = await Task.create({
            title,
            description,
            deadline,
            service_id: req.user.service_id,
            assigned_by: req.user.id,
            assigned_to: assigned_to
        });

        if(task){
            res.status(201).json({ message: "Task created successfully", task })
        }
        else{
            res.status(400).json({ message: "Task not created" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTaskByAdmin = async (req, res) => {
    try {

        let query;

        if(req.query.id)
        {
            query = Task.find({ _id: req.query.id });
        }
        else
        {
            query = Task.find({service_id:req.user.service_id});
        }

        const tasks = await query.populate({
            path:'assigned_by',
            select:'-password -role -is_active -service_id -__v -createdAt -updatedAt -email'
        }).populate({
            path: 'assigned_to',
            select: '-password -role -is_active -service_id -__v -createdAt -updatedAt -email'
        }).select("-service_id -__v -createdAt -updatedAt");

        if(tasks.length > 0){
            res.status(200).json({ message: "Tasks fetched successfully", tasks })
        }
        else{
            res.status(200).json({ message: "No tasks found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const { status, title, description, deadline } = req.body;
        const { id } = req.params;

        const updated = await Task.findByIdAndUpdate({_id:id}, { 
            $set: { 
                status: status,
                title: title,
                description: description,
                deadline: deadline
             }
         }, { new: true });

        if(updated){
            res.status(200).json({ message: "Task status updated successfully", updated })
        }
        else{
            res.status(400).json({ message: "Task status not updated" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Task.findByIdAndDelete({_id:id});
        if(deleted)
        {
            res.status(200).json({ message: "Task deleted successfully"})
        }
        else{
            res.status(400).json({ message: "Task not deleted" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTaskByUser = async (req, res) => {
    try {
        const id = req.user.id;
        let query;

        if(req.query.id)
        {
            query = Task.find({ _id: req.query.id, assigned_to: id });
        }
        else
        {
            query = Task.find({assigned_to: id});
        }

        const tasks = await query.populate({
            path:'assigned_by',
            select:'-password -role -is_active -service_id -__v -createdAt -updatedAt -email'
        }).populate({
            path: 'assigned_to',
            select: '-password -role -is_active -service_id -__v -createdAt -updatedAt -email'
        }).select("-service_id -__v -createdAt -updatedAt");

        console.log(tasks);

        if(tasks.length > 0){
            res.status(200).json({ message: "Tasks fetched successfully", tasks })
        }
        else{
            res.status(200).json({ message: "No tasks found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updated = await Task.findByIdAndUpdate({_id:id}, { 
            $set: { 
                status: status,
             }
         }, { new: true });

        if(updated){
            res.status(200).json({ message: "Task status updated successfully", updated })
        }
        else{
            res.status(400).json({ message: "Task status not updated" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createTask, getTaskByAdmin, updateTaskStatus, deleteTask, getTaskByUser, updateStatus }