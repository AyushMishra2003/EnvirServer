import express from 'express'
import cloudinary from 'cloudinary'
import User from '../models/user.model.js'
import AppError from '../utils/error.util.js'
import fs from 'fs/promises'
import emailValidator from 'email-validator'


const cokkieOption={
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
}


const register=async(req,res,next)=>{
   const {fullName,email,password,number,role}=req.body

   if(!fullName || !email || !password || !number)
   {
    return(next(new AppError("All field are Required",400)))
   }

   if(fullName.length<3)
   {
    return(next(new AppError("Full Name is not Valid",400)))
   }

   if(number.length!=10){
    return(next(new AppError("Number is not Valid",400)))
   }


   const user=await User.create({
    fullName,
    email,
    password,  
    avatar:{
     public_id:'',
     secure_url:''
    }
 })

 if(!user){
    return(next(new AppError("User registration failed",400)))
 }
 if(req.file){
    try{
     const result=await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms',
        width:250,
        height:250,
        gravity:'faces',
        crop:'fill'
     })
     console.log(result);
     if(result){
        user.avater.public_id=result.public_id;
        user.avater.secure_url=result.secure_url

        fs.rm(`uploads/${req.file.filename}`)
     }
    }catch(e){  
       return next(
        new AppError("File not uploaded please try later",500)
       )    
    }
}

await user.save()
user.password=undefined
if(role){
    user.role=role
}

const token=await user.generateJWTToken()

res.cookie('token',token,cokkieOption)

res.status(200).json({
    success:true,
    "message":"REGISTRED SUCCEFULLY",
    user
})
}


const login=async(req,res,next)=>{
  try{
    const {email,password}=req.body
    console.log(email,password);
    
    if(!email || !password){
     return next(new AppError('All fields are required',400))
    }
    
    const user=await User.findOne({
         email
    }).select('+password')

    console.log(User);
    // const user = await User.findOne({})


    // // .select('+password')
    // console.log(user);

    const isPassword=await user.comparePassword(password)
    // const isPassword=await user.comparePassword(password)
    if(!user || !isPassword){
     return next(new AppError("Email or Password not matched",400))
    }
  

    console.log("hyyy");
    const token=await user.generateJWTToken()
 
    user.password=undefined
    res.cookie('token',token,cokkieOption)
    res.status(200).json({
     success:true,
     "message":"Login Succesfully",
     user,
    })
  }catch(error){
    return(next(new AppError(error.message,500)))
  } 
}


export{
    register,
    login
}
