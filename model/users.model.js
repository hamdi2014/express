const mongoose=require("mongoose");
const valid=require("validator");

const User=mongoose.model("User",{
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    age:{
        type:Number,
        min:[0,"Not valid!"],
        max:[100]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    userName:{
        type:String,
        minLength:4,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("admin") || value.toLowerCase().includes("root")){
                throw new Error("userName includes invalid words!!!")
            }
            return true
        }
        // validate:{
        //     validator:function(userName){
        //         return userName.length>4
        //     },
        //     message: props => `${props.value} is lower than 5 character!`
        // }
        // unique:true
    },
    email:{
        type:String,
        validate:{
            validator:(email)=>{
                return valid.isEmail(email)
            },
            message: props => `${props.value} is not email format!`
        },
        required:true
    }
});

module.exports=User;