import mongoose, { Mongoose } from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        requried:true
    },
    address:{
        type:String,
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    discountedPrice:{
        type:String,
        required:false
    },
    bathrooms:{
        type:Number,
        requried:true,
    },
    bedrooms:{
        type:Number,
        required:true
    },
    furnished:{
        type:Boolean,
        requried:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageUrls:{
        type:Array,
        required:true
    },
    userRef:{
        type:String,
        required:true
    },
},{timestamps:true})

const Listing = mongoose.model('Listing',listingSchema);

export default Listing