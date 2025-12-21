import Message from "../schema/message.js";
import crudRepository from "./crudRepository.js";

 const messageRepository = {  
    ...crudRepository(Message),
    getPaginatedMessages: async function(messageParams,page,limit){
        const messages = Message.find(messageParams)
        .sort({createdAt:-1})
        .skip((page-1) * limit)
        .limit(limit)
        .populate('senderId','username avatar email');
        return messages;
    }
}

export default messageRepository;
