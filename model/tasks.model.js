const mongoose=require("mongoose");

const Task=mongoose.model("Task",{
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    createTime:{
        type:Date,
        default:Date.now()
    },
    isComplete:{
        type:Boolean,
        default:false,
        required:true
    }
});

module.exports=Task;