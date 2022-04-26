const mongoose=require("mongoose");
const Session=mongoose.model("Session",{
    session:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true
    }
});

module.exports=Session;