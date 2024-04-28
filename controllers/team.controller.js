import express from 'express'
import cloudinary from 'cloudinary'
import Team from '../models/Team.model.js'
import AppError from '../utils/error.util.js'
import fs from 'fs/promises'

const addTeam=async(req,res,next)=>{
try{
    // Extract TeamName and Profession from request Body
    const {teamName,teamProfession,teamImage}=req.body
     
    console.log(req.body);
    // Check condtion all field are Required or not
    if(!teamName || !teamProfession){
        return next(new AppError("All field are Required"))
    }

    const team=await Team.create({
        teamName,
        teamProfession,
        teamImage:{
            public_id:"",
            secure_url:""
        }
    })

    if(!team){
        return next(new AppError("Team Not created",400))
    }

    if(req.file){
         try{
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill',
                })
    
                if (result) {
                    team.teamImage.public_id = result.public_id
                    team.teamImage.secure_url = result.secure_url
                    // Removing the temporary file after upload
                    fs.rm(`uploads/${req.file.filename}`)
                }
            }catch(err){
               return next(new AppError(err.message,500))
            }
        }

    await team.save()

    res.status(200).json({
        success:true,
         message:"Added Sucessfully",
        team
    })
}catch(error){
    return next(new AppError(error.message))
}
}


const getTeam=async(req,res,next)=>{
    try{
       
      const team=await Team.find({})

      console.log(team);
      
      if(!team){
        return next(new AppError("Team Not Found",400))
      }

      res.status(200).json({
        success:true,
        message:"Team Data Succesfully",
        team
      })

    }catch(error){
        return next(new AppError(error.message))
    }
}

const handleTeam=async(req,res,next)=>{
try{
    const {id}=req.params
     
    const {teamName,teamProfession}=req.body

    const team=await Team.findById(id)

    console.log(team);

    if(!team){
        return next(new AppError("Team Data not found"))
    }
   
    if(req.file){
        try{
               const result = await cloudinary.v2.uploader.upload(req.file.path, {
                   folder: 'lms',
                   width: 250,
                   height: 250,
                   gravity: 'faces',
                   crop: 'fill',
               })
   
               if (result) {
                   team.teamImage.public_id = result.public_id
                   team.teamImage.secure_url = result.secure_url
                   // Removing the temporary file after upload
                   fs.rm(`uploads/${req.file.filename}`)
               }
           }catch(err){
              return next(new AppError(err.message,500))
           }
       }

    team.teamName=teamName,
    team.teamProfession=teamProfession

    await team.save()

    res.status(200).json({
        success:true,
        message:"Team Updated  Succesfully",
        team  
    })

}catch(error){
    return next(new AppError(error.message))
}
}

const deleteTeam=async(req,res,next)=>{
try{     
    const {id}=req.params

    const team=await Team.findById(id)

    if(!team){
        return next(new AppError("Team Data not Found",400))
    }
   
    await Team.findByIdAndDelete(id)

    res.status(200).json({
        success:true,
        message:"Team Data delete Sucessfully"
    })
}catch(error){
    return next(error.message,500)
}
}



export {
    addTeam,
    getTeam,
    handleTeam,
    deleteTeam
}