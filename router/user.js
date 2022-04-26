const express=require("express");
const router=express.Router();
const User=require('../model/users.model')

router.get('/',(req,res)=>{
    User.find().exec((err,result)=>{
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else{
            res.send(result);
        };
    })
});

router.get('/:id',(req,res)=>{
    User.findById(req.params.id).exec((err,user)=>{
        if(err){
            if(!user){
                return res.sendStatus(404)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(user);
    })
})

router.put('/:id',(req,res)=>{
    User.findById(req.params.id).exec((err,user)=>{
        if(err){
            if(!user){
                return res.sendStatus(404)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        req.body.age!==undefined && (user.age=req.body.age);
        req.body.firstName!==undefined && (user.firstName=req.body.firstName);
        req.body.lastName!==undefined && (user.lastName=req.body.lastName);
        req.body.isActive!==undefined && (user.isActive=req.body.isActive);
        user.save().then(savedUser=>{
            res.json(savedUser)
        })
    })
});

router.delete('/:id',(req,res)=>{
    User.findByIdAndDelete(req.params.id).exec((err,deletedUser)=>{
        if(err){
            if(!deletedUser){
                return res.sendStatus(404)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        res.sendStatus(200);
    })
})

router.post('/',(req,res)=>{
    const person=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        age:req.body.age,
        isActive:req.body.isActive===undefined ? true : req.body.isActive, 
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

router.post('/users',(req,res)=>{
    res.send(200)
});

module.exports=router