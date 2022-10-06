const mongoose = require('mongoose')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection); 

const UserSchema = new mongoose.Schema({
employeeNo:{
        type:Number,
        required:true,
        unique:true,
         trim:true,
        
    },
username:{
        type:String,
        required:[true,"Enter usernme"],
},

address:{
    type:String,
    trim:true,
},
email:{
    type:String,
    required:[true,"Enter email"],
    //unique:true,
    match:[/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ ,"please enter a valid email"]
},
password:{
    type:String,
    required:[true,"Enter password"],
    minlength:3,
    select:false,
},
phoneNo:{
    type:String,
    trim:true,
    required:true,
},

role:{
    type:String,
    trim:true,
    
},
tickers:[String],
signedToken:String,
resetPasswordToken:String,
resetpasswordExpire:Date,
},{ timestamps: true });
UserSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    {
        next()
    }
    const salt =await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
});
UserSchema.methods.getSignedToken = function()
{
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
}
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
   
}

  
UserSchema.methods.getResetPasswordToken= function()
{
    
    const resetToken= crypto.randomBytes(20).toString("hex")
   
    this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire= Date.now()+10 *(60*1000)
    return resetToken
}
UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'employeeNo',startAt: 1,});

const User= mongoose.model("User",UserSchema)
module.exports=User;