import { Schema,model } from "mongoose";


const FoodSchema=new Schema(
    {  
       foodName:{
         type:String,
         required:true
       },

       foodDescription:{
          type:String,
          required:true
       },
       foodImage:{
        public_id:{
            type:'String'
        },
        secure_url:{
            type:'String'
        }
       }
    },
    {
        timestamps:true
    }
)


const FoodProduct=model('FoodProduct',FoodSchema)

export default FoodProduct