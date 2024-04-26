import { Schema,model } from "mongoose";


const FoodSchema=new Schema(
    {
       FoodImage:{
        public_id:{
            type:'String'
        },
        secure_url:{
            type:'String'
        }
       },
       
       FoodName:{
         type:String,
         required:true
       }
    },
    {
        timestamps:true
    }
)


const FoodProduct=model('FoodProduct',FoodSchema)

export default FoodProduct