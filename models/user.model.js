import mongoose, { Schema,model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema=new Schema(
    {
          fullName:{
            type:'String',
            required:[true,"Name is Required"],
            minLength:[4,"Nmae must be 5 character"],
            maxLength:[50,"Name should be less than 50 character"],
            lowercase:true,
            trim:true
          },
          email:{
            type:'String',
            required:[true,"Email is required"],
            lowercase:true,
            trim:true,
            unique:true,
          },
          number:{
            type:'Number'
            // required:true
          },
          password:{
            type:'String',
            required:[true,"password is required"],
            minLength:[5,"password must be atleast 5 characters"],
            select:false
          },
          avater:{
            public_id:{
                type:'String'
            },
            secure_url:{
                type:'String'
            }
          },
          role:{
            type:'String',
            enum:['USER','ADMIN'],
            default:'USER'
       },
    },
    {
        timestamps:true
    }

)


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
    return next()
})


userSchema.methods={
    generateJWTToken:async function(){
        return await jwt.sign(
            {id:this._id,email:this.email,fullName:this.fullName,role:this.role},
            process.env.SECRET,
            {
                expiresIn:'24h'
            }
        ) 
    },
    comparePassword:async function(plaintextPassword){
        return await bcrypt.compare(plaintextPassword,this.password)
     }
}

const User=model("USET",userSchema)


export default User


