import mongoose from "mongoose";

const companySchema= mongoose.Schema({
    name:{type:String},
    email:{type:String},
    phone:{type:String},
    place:{type:String},
    userID:{type:String},
    profile:{type:String}

    

   
})

export default mongoose.model.companies||mongoose.model('company',companySchema)