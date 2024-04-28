import FoodProduct from "../models/FoodProduct.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const addFoodProduct=async(req,res,next)=>{
  try{
    const {foodName,foodDescription}=req.body
    if(!foodName || !foodDescription){
        return next(new AppError("All field are Required bhaiya"))
    }

    const foodProduct=await FoodProduct.create({
        foodName,
        foodDescription,
        foodImage:{
            public_id:"",
            secure_url:""
        }
    })
    
    console.log(foodProduct);
   
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
                     foodProduct.foodImage.public_id=result.public_id
                     foodProduct.foodImage.secure_url=result.secure_url
                   // Removing the temporary file after upload
                   fs.rm(`uploads/${req.file.filename}`)
               }
           }catch(err){
              return next(new AppError(err.message,500))
           }
       }

    await foodProduct.save()

    res.status(200).json({
        success:true,
        message:"Product Added Successfully",
        foodProduct
    })


  }catch(error){
    return next(error.message)
  }
}


const getFoodProduct=async(req,res,next)=>{
   try{
     const foodProduct=await FoodProduct.find({})
     
     if(!foodProduct){
        return next(new AppError("Food Product is not found"))
     }

     res.status(200).json({
        success:true,
        message:"All Food Product",
        foodProduct
     })
    

   }catch(error){
    return next(new AppError(error.message))
   }
}


const deleteProduct=async(req,res,next)=>{
try{    
    const {id}=req.params

    const product=FoodProduct.findById(id)

    if(!product){
        return next(new AppError("Product Not Found "))
    }
}catch(error){
    return next(error.message)
}
}



export {
    addFoodProduct,
    getFoodProduct
}