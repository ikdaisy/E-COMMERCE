import mongoose from "mongoose";

const addressSchema= mongoose.Schema({
    userID:{type:String},
    house:{type:String},
    place:{type:String},
    pincode:{type:String}
    

   
})

export default mongoose.model.addresses||mongoose.model('address',addressSchema)