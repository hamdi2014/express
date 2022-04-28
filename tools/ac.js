const accessController={};

accessController.checkAdminRoleMiddleWare=(req,res,next)=>{
    if(req.user.role==='admin'){
        return next()
    }
    return res.sendStatus(403)
}

module.exports=accessController;