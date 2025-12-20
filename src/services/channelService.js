import { StatusCodes } from "http-status-codes";
import channelRepository from "../repositories/channelRepository.js"
import ClientError from "../utils/errors/clientError.js";

import { isUserMemberOfWorkspace } from "./workspaceService.js";

// export const isUserMemberOfWorkspace = (c)

export const getChannelByIdService = async function (channelId, memberId){
    try {
        const channel = await channelRepository.getChannelDetails(channelId);
        
        // console.log("channel:",channel,memberId);

        if(!channel){
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message:"Channel not found",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        const isMember =isUserMemberOfWorkspace(channel.workspaceId,memberId);
        

        if(!isMember){
            throw new ClientError({
                explanation: "User is not member of workspace hence can't access channel details",
                message:"Channel not accesible",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        return channel;

    } catch (error) {
        console.log("error in getChannelByService:",error);
        throw error;
    }
}