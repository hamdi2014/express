const accessController={};

accessController.checkAdminRoleMiddleWare=(req,res,next)=>{
    if(req.user.role==='admin'){
        return next()
    }
    return res.sendStatus(403)
}

accessController.checkUserRoleAccessForDeleteAndUpdateUserData=(req,res,next)=>{
    if(req.user.role!=='admin' && req.params.id==="me"){
        res.locals.userId=req.user._id
        return next()
    }
    if(req.user.role==='admin'){
        res.locals.userId=req.params.id
        return next();
    }
    return res.sendStatus(403)
}

module.exports=accessController;