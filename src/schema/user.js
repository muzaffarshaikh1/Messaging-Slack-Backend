import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'Email already Exists'],
        match:[/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,'Invalid Format']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:[true,'Username already Exists'],
        minLenth:[3,'Username must be atleast 3 charcters'],
        match: [/^[a-zA-Z0-9_]{3,20}$/, 'Invalid username format']
    },
    avatar:{
        type:String,
    }
},{timestamps:true});

userSchema.pre('save', function() {
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = hashedPassword;
    user.avatar = `https://robohash.org/${user.username}`;
});

const User = mongoose.model('User',userSchema);

export default User;