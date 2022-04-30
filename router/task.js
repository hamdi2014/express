const express=require("express");
const router=express.Router();
const Task=require('../model/tasks.model');

router.get('/',async(req,res)=>{
    try {
        const query={user:req.user._id};
        if(req.query.complete==='true'){
            query.isComplete=true;
        }
        if(req.query.complete==='false'){
            query.isComplete=false;
        };
        const tasks=await Task.find(query);
        res.send(tasks);
    } catch (error) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.get('/:id',async(req,res)=>{
    try {
        const task=await Task.find({user:req.user._id,_id:req.params.id});
        if(!task[0]){
            return res.sendStatus(404)
        }
        res.json(task[0]);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
});

router.post('/',async(req,res)=>{
    try {
        const taskObj={
            title:req.body.title,
            user:req.user._id
        };
        if(req.body.description!==undefined){
            taskObj.description=req.body.description;
        }
        const newTask=new Task(taskObj);
        await newTask.save()
        res.send(newTask)
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
});

router.put('/:id',async(req,res)=>{
    try {
        const updates=Object.keys(req.body);
        const allowedToUpdate=['description','isComplete'];
        const isValidation=updates.every(update=>allowedToUpdate.includes(update));
        if(!isValidation) return res.status(500).send("Invalid Request!!!");
        const updatedTask=await Task.findOneAndUpdate({
            _id:req.params.id,
            user:req.user._id
        },req.body,{new:true,runValidators: true});
        if(!updatedTask){
            return res.sendStatus(404);
        }
        res.json(updatedTask);
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
});

router.delete('/:id',async(req,res)=>{
    try {
        const deletedTask=await Task.findOneAndDelete({_id:req.params.id,user:req.user._id});
        if(!deletedTask){
            return res.sendStatus(404)
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(err)
        return res.sendStatus(500)
    }
});

module.exports=router;