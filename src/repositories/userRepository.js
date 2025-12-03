import User from "../schema/user";
import crudRepository from "./crudRepository";

export const getUserByEmail = async(email) =>{
    const user = await User.findOne({email});
    return user;
}

export const getUserByName = async(name)=>{
    const user = await User.findOne({username:name});
    return user;
}

export const userRepository = {  
    ...crudRepository(User),
    getByEmail:async function(email){
        const user = await User.findOne({email});
        return user;
    },
    getByName:async function(username){
        const user = await User.findOne({username});
        return user;
    },
}
