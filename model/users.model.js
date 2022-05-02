const mongoose=require("mongoose");
const valid=require("validator");
const bcrypt=require("bcrypt");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:[0,"Not valid!"],
        max:[100]
    },
    isActive:{
        type:Boolean,
        default:true,
        required:true
    },
    role:{
        type:String,
        enum:["admin","client"],
        default:"client",
        required:true
    },
    userName:{
        type:String,
        required:true,
        minLength:4,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(value.toLowerCase().includes("admin") || value.toLowerCase().includes("root")){
                throw new Error("userName includes invalid words!!!")
            }
            return true
        }
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
    },
    password:{
        type:String,
        minLength:5,
        trim:true,
        required:true
    }
});

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
    };
    next();
});

userSchema.pre('findOneAndUpdate',async function(next){
    console.log(this._update);
    if(this._update.password && this._update.password.trim().length>4){
        this._update.password=await bcrypt.hash(this._update.password,10);
    }else{
        delete this._update.password;
    }
    next();
});

userSchema.statics.findForLogin=async function(userName,password){
    const user= await this.findOne({userName});
    if(!user)return;
    const isMatchPassword=await bcrypt.compare(password,user.password);
    if(!isMatchPassword) throw new Error("UserName and Password is not matched!!!");
    return user
}

module.exports=mongoose.model('User',userSchema);