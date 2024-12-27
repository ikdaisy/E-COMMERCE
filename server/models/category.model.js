import mongoose from "mongoose";

const categorySchema= mongoose.Schema({
    category:{type:String} 
})


export default mongoose.model.categories||mongoose.model('category',categorySchema)