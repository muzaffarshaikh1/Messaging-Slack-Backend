import Channel from "../schema/channel.js";
import crudRepository from "./crudRepository.js";

 const channelRepository = {  
    ...crudRepository(Channel),
    getChannelDetails: async function(channelId){
        const response = Channel.findById(channelId).populate('workspaceId');
        return response;
    }
}

export default channelRepository;
