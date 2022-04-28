const express=require("express");
const router=express.Router();
const User=require('../model/users.model');
const ac=require('../tools/ac')

router.get('/',ac.checkAdminRoleMiddleWare, async (req,res)=>{
    try {
        const users=await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
});

router.get('/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.sendStatus(404);
        res.json(user)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.put('/:id',async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user) return res.sendStatus(404);
        req.body.age!==undefined && (user.age=req.body.age);
        req.body.firstName!==undefined && (user.firstName=req.body.firstName);
        req.body.lastName!==undefined && (user.lastName=req.body.lastName);
        req.body.isActive!==undefined && (user.isActive=req.body.isActive);
        await user.save();
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
});

router.delete('/:id',async(req,res)=>{
    try {
        const deletedUser=await User.findByIdAndDelete(req.params.id);
        if(!deletedUser) return res.sendStatus(404);
        res.json(deletedUser);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

router.post('/',async(req,res)=>{
    try {
        const person=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            age:req.body.age,
            isActive:req.body.isActive===undefined ? true : req.body.isActive, 
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password
        });
        await person.save();
        res.send(person)
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
    
})

router.post('/users',(req,res)=>{
    res.send(200)
});

module.exports=router