const express=require("express");
const router=express.Router();
const User=require('../model/users.model');
const queryTools=require('../tools/query')
const ac=require('../tools/ac');
const bcrypt=require("bcrypt");

router.get('/',ac.checkAdminRoleMiddleWare, async (req,res)=>{
    try {
        const skip=req.query?.skip?Number(req.query.skip):0;
        const limit=(req.query?.limit && Number(req.query.limit)<=10)?Number(req.query.limit):10;
        const sort=req.query?.sort?queryTools.createSort(req.query.sort):{};
        const users=await User.find().skip(skip).limit(limit).sort(sort);
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

router.put('/:id',ac.checkUserRoleAccessForDeleteAndUpdateUserData,async(req,res)=>{
    try {
        const updates=Object.keys(req.body);
        const allowedToUpdate=['age','firstName','lastName','password'];
        const isValidation=updates.every(update=>allowedToUpdate.includes(update));
        if(!isValidation) return res.status(500).send("Invalid Request!!!");
        // if(req.body.password) req.body.password=await bcrypt.hash(req.body.password,10);
        const updatedUser=await User.findByIdAndUpdate(res.locals.userId,req.body,{new:true,runValidators: true});
        if(!updatedUser) return res.sendStatus(404);
        res.json(updatedUser);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
});

router.delete('/:id',ac.checkUserRoleAccessForDeleteAndUpdateUserData,async(req,res)=>{
    try {
        console.log(res.locals,'ok');
        const deletedUser=await User.findByIdAndDelete(res.locals.userId);
        if(!deletedUser) return res.sendStatus(404);
        res.json(deletedUser);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

router.post('/',ac.checkAdminRoleMiddleWare,async(req,res)=>{
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
    
});

router.post('/users',(req,res)=>{
    res.send(200)
});

module.exports=router