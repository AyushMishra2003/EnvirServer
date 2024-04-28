import { Schema,model } from "mongoose";


const TeamSchema=new Schema(
    {
       teamImage:{
        public_id:{
            type:'String'
        },
        secure_url:{
            type:'String'
        }
       },
       teamName:{
        type:String,
        required:true
       },
       teamProfession:{
        type:String,
        required:true
       }
    },
    {
        timestamps:true
    }
)

const Team=model("Team",TeamSchema)


export default Team