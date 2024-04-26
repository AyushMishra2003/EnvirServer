import {Schema,model} from "mongoose"



const ReasearchSchema=new Schema(
    {
        thumbnail:{
            public_id:{
                type:'String'
            },
            secure_url:{
                type:'String'
            }
        },

        title:{
            type:String,
            required:true,
            minLength:[13,"title must be 13 character"],
            maxLength:[50,"title should be less than 50 character"],
        },

        description:{
            type:String,
            required:true,
            minLength:[30,"Description must be 30 character"],
            maxLength:[150,"Descripion should be less than 150 character"]
        }
    },
    {
        timestamps:true
    }
)

const Research=model("Research",ReasearchSchema)

export default Research