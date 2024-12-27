import mongoose from "mongoose";

const productSchema= mongoose.Schema({
    name:{type:String},
    price:{type:String},
    photo:{type:Array},
    category:{type:String},
    sizes:{type:Array}
   
})

export default mongoose.model.products||mongoose.model('product',productSchema)