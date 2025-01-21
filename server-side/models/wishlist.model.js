import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
    buyerID:{type:String},
    productID:{type:String}
}) 

export default mongoose.model.Wishlists || mongoose.model("Wishlist",wishlistSchema);