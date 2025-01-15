import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    buyerID:{type:String},
    product:{type:Object},
    address:{type:Object},
    totalPrice:{type:String},
    createdAt: {
        type: Date,
        default: Date.now,  // Automatically sets the current date and time when the document is created
      }
   
}) 

export default mongoose.model.orders || mongoose.model("order",orderSchema);