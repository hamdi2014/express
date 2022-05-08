const express=require("express");
const uuid=require("uuid");
const Session=require('../model/session.model');
const router=express.Router();
const User=require('../model/users.model');
const RefreshToken=require("../model/refresh-token.model");
const appConfig=require('../configs/app');
const { isLoginBySession,createTokenForLogin,isLoginByJasonWebToken } = require("../tools/auth");
const mongoose=require("mongoose");

router.post('/login',async(req,res,next)=>{
    try {
        if(!req.body || !req.body.userName || !req.body.password){
            return res.sendStatus(400);
        };
        const user=await User.findForLogin(req.body.userName,req.body.password);
        if(!user){
            return res.sendStatus(404)
        };
        const session=uuid.v4();
        res.cookie('session',session,{maxAge:appConfig.sessionTime});
        const newSession=new Session({
            session,
            user:user._id
        });
        await newSession.save()
        res.json(user)
    } catch (error) {
        next(error)
    };
});

router.post('/logout',isLoginBySession,async(req,res,next)=>{
    try {
        if(req.user){
            await Session.findOneAndRemove({user:req.user._id});
            res.clearCookie("session");
        }
        res.sendStatus(200);;
    } catch (error) {
        next(error);
    }
})

router.post('/login/jwt',async(req,res,next)=>{
    try {
        if(!req.body || !req.body.userName || !req.body.password){
            throw {
                status:400,
                message:"Required fields are empty!",
                originError: new Error("Login empty fields!")
            }
        };
        const user=await User.findForLogin(req.body.userName,req.body.password);
        await createTokenForLogin(user,res);
        
        res.json({user});
    } catch (error) {
        next(error)
    };
});

router.post('/logout/jwt',isLoginByJasonWebToken,async(req,res,next)=>{
    try {
        if(req.user){
            await RefreshToken.findOneAndRemove({user:req.user._id});
            res.clearCookie("session");
            res.removeHeader("authorization");
            console.log(123)
        };
        res.sendStatus(200);
    } catch (error) {
        next(error)
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