const express=require("express");
const uuid=require("uuid");
const Session=require('../model/session.model');
const router=express.Router();
const User=require('../model/users.model');
const bcrypt=require("bcrypt");

router.post('/login',async(req,res)=>{
    try {
        if(!req.body || !req.body.userName || !req.body.password){
            return res.sendStatus(400);
        };
        const hashedString=await bcrypt.hash('alireza',10);
        console.log('alireza',hashedString);
        const isMatch=await bcrypt.compare('alireza',hashedString);
        console.log(isMatch)
        const user= await User.findOne({userName:req.body.userName});
        if(!user){
            return res.sendStatus(404)
        };
        if(user.password!==req.body.password){
            return res.sendStatus(403);
        };
        const session=uuid.v4();
        res.cookie('session',session,{maxAge:1000*60*10});
        const newSession=new Session({
            session,
            user:user._id
        });
        await newSession.save()
        res.json(user)
    } catch (error) {
        console.log(err);
        return res.sendStatus(500);
    };
});

router.post('/register',async(req,res)=>{
    try {
        if(!req.body || !req.body.firstName || !req.body.lastName || 
        !req.body.userName || !req.body.email || !req.body.password){
            return res.sendStatus(400);
        }
        const updates=Object.keys(req.body);
        const allowedToUpdate=['age','firstName','lastName','password','userName','email'];
        const isValidation=updates.every(update=>allowedToUpdate.includes(update));
        const person=new User(req.body);
        await person.save();
        res.send(person)
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
})

module.exports=router