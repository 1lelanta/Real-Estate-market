import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"

    },


},{timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;