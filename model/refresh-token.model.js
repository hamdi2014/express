const mongoose=require("mongoose");
const refreshTokenSchema=mongoose.Schema({
    refreshToken:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
})
const RefreshToken=mongoose.model("RefreshToken",refreshTokenSchema);

module.exports=RefreshToken;