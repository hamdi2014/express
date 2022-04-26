const Session=require('../model/session.model')
const isLogin=(req,res,next)=>{
    if(!req.cookies.session){
        return res.sendStatus(401)
    };
    Session.findOne({session:req.cookies.session}).exec((err,session)=>{
        if(err){
            console.log(err);
            return res.sendStatus(500);
        };
        if(!session){
            return res.sendStatus(401);
        }
        return next();
    })
}

module.exports=isLogin;