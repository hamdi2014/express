const express=require("express");
const router=express.Router();
const Task=require('../model/tasks.model');

router.get('/',(req,res)=>{
    const query={};
    if(req.query.complete==='true'){
        query.isComplete=true;
    }
    if(req.query.complete==='false'){
        query.isComplete=false;
    }
    Task.find(query).exec((err,tasks)=>{
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else{
            res.send(tasks);
        };
    })
});

router.get('/:id',(req,res)=>{
    Task.findById(req.params.id).exec((err,task)=>{
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        if(!task){
            return res.sendStatus(404)
        }
        res.send(task);
    })
});

router.post('/',(req,res)=>{
    const newTask=new Task({
        title:req.body.title,
        description:req.body.description,
        createTime:req.body.createTime,
        isComplete:req.body.isComplete
    });
    newTask.save().then((savedNewTask)=>{
        res.send(savedNewTask)
    }).catch((err)=>{
        console.log(err);
        res.status(500);
        res.send(err.message)
    })
});

router.put('/:id',(req,res)=>{
    Task.findById(req.params.id).exec((err,task)=>{
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        if(!task){
            return res.sendStatus(404)
        }
        req.body.title!==undefined && (task.title=req.body.title);
        req.body.description!==undefined && (task.description=req.body.description);
        task.createTime=Date.now();
        req.body.isComplete!==undefined && (task.isComplete=req.body.isComplete);
        task.save().then(savedTask=>{
            res.json(savedTask)
        })
    })
});

router.delete('/:id',(req,res)=>{
    Task.findByIdAndDelete(req.params.id).exec((err,deletedTask)=>{
        if(err){
            console.log(err)
            return res.sendStatus(500)
        };
        if(!deletedTask){
            return res.sendStatus(404)
        }
        console.log(deletedTask);
        res.sendStatus(200);
    })
});

module.exports=router;