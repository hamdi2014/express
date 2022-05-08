const Session=require('../model/session.model');
const RefreshToken=require('../model/refresh-token.model');
const uuid=require('uuid');
const jwt=require("jsonwebtoken");
const appConfig=require('../configs/app')

const isLoginBySession=async(req,res,next)=>{
    try {
        if(!req.cookies.session){
            return res.sendStatus(401)
        };
        const session=await Session.findOne({session:req.cookies.session}).populate('user','_id role isActive');
        if(!session){
            return res.sendStatus(401);
        };
        req.user=session.user;
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

const isLoginByJasonWebToken=async(req,res,next)=>{
    try {
       if(!req.headers.authorization){
        return res.sendStatus(401)
       }
       const user=await jwt.verify(req.headers.authorization,appConfig.JWTSecret,async(error,token)=>{
           if(error){
               if(error.name==="TokenExpiredError"){
                    if(!req.cookies.session){
                        console.log('err1')
                        throw {
                            status:423,
                            message:"Your token expired!",
                            originError:error
                        }
                    };
                    const refreshToken=await RefreshToken.findOne({refreshToken:req.cookies.session}).populate('user');
                    if(!refreshToken){
                        console.log('err2')
                        throw {
                            status:423,
                            message:"Your token expired!",
                            originError:error
                        }
                    };
                    refreshToken.refreshToken=uuid.v4();
                    refreshToken.token=await createToken(refreshToken.user);
                    await refreshToken.save();
                    console.log('new')
                    res.cookie('session',refreshToken.refreshToken,{maxAge:appConfig.sessionTime});
                    res.setHeader('Authorization',refreshToken.token);
                    return refreshToken.user;
                
               }else{
                   throw {
                        status:403,
                        message:"Invalid token!",
                        originError:error
                   }
               }
           }else{
               return token.user
           }
       });
       req.user=user;
       return next();
    } catch (error) {
        console.log(error)
        return next(error)
    }
};

const createTokenForLogin=async(user,res)=>{
    try {
        const token=createToken(user);
        const refreshToken=new RefreshToken({
            refreshToken:uuid.v4(),
            token,
            user:user._id
        });
        await refreshToken.save();
        res.cookie('session',refreshToken.refreshToken,{maxAge:appConfig.sessionTime});
        res.setHeader('Authorization',refreshToken.token);
    } catch (error) {
        throw error
    }
    
}

const createToken=(user)=>{
    return jwt.sign({user},appConfig.JWTSecret,{expiresIn:appConfig.jwtTime});
}
module.exports={
    isLoginBySession,
    isLoginByJasonWebToken,
    createTokenForLogin
};