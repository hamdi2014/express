const express=require("express");
const router=express.Router();
const User=require('../model/users.model');

router.post('/login',(req,res)=>{
    if(!req.body || !req.body.userName || !req.body.password){
        return res.sendStatus(400);
    }
    User.findOne({userName:req.body.userName}).exec((err,user)=>{
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        if(!user){
            return res.sendStatus(404)
        }
        if(user.password!==req.body.password){
            return res.sendStatus(403);
        }
        res.json(user)
    })
})

module.exports=router