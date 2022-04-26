const express=require("express");
const uuid=require("uuid");
const Session=require('../model/session.model');
const router=express.Router();
const User=require('../model/users.model');

router.post('/login',(req,res)=>{
    console.log(req.cookies);
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
        const session=uuid.v4();
        res.cookie('session',session,{maxAge:1000*60*10});
        const newSession=new Session({
            session,
            user:user._id
        });
        newSession.save().then().catch(err=>{
            if(err) console.log(err);
        })
        res.json(user)
    })
});

router.post('/register',(req,res)=>{
    if(!req.body || !req.body.firstName || !req.body.lastName || 
    !req.body.userName || !req.body.email || !req.body.password){
        return res.sendStatus(400);
    }
    const person=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        age:req.body.age===undefined ? null : req.body.age, 
        userName:req.body.userName,
        email:req.body.email,
        password:req.body.password
    });
    person.save().then((savedPerson)=>{
        res.send(savedPerson)
    }).catch((err)=>{
        console.log(err);
        res.status(500);
        res.send(err.message)
    })
})

module.exports=router