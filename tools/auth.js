const Session=require('../model/session.model');
const isLogin=async(req,res,next)=>{
    try {
        if(!req.cookies.session){
            return res.sendStatus(401)
        };
        const session=await Session.findOne({session:req.cookies.session}).populate('user','_id role isActive');
        if(!session){
            return res.sendStatus(401);
        }
        req.user=session.user;
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

module.exports=isLogin;