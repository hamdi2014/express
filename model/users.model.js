const mongoose=require("mongoose");
const valid=require("validator");
const bcrypt=require("bcrypt");
const Task=require("./tasks.model");
const Session=require("./session.model");

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

userSchema.methods.toJSON=function(){
    const objectData=this.toObject();
    delete objectData.__v;
    delete objectData.isActive;
    delete objectData.password;
    return objectData;
}

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

userSchema.post('findOneAndDelete',async function(deletedUser){
    await Task.deleteMany({user:deletedUser._id});
    await Session.deleteMany({user:deletedUser._id});
})

userSchema.statics.findForLogin=async function(userName,password){
    const user= await User.findOne({userName});
    if(!user)return;
    const isMatchPassword=await bcrypt.compare(password,user.password);
    if(!isMatchPassword) throw {
        status:400,
        message:"UserName and Password is not matched!!!",
    };
    return user
}

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'user'
})

const User=mongoose.model('User',userSchema);

module.exports=User;