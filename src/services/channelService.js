import { StatusCodes } from "http-status-codes";
import channelRepository from "../repositories/channelRepository.js"
import ClientError from "../utils/errors/clientError.js";

import { isUserMemberOfWorkspace } from "./workspaceService.js";
import { getPaginatedMessagesService } from "./messageService.js";

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
        
        // console.log("isMember",isMember);

        if(!isMember){
            throw new ClientError({
                explanation: "User is not member of workspace hence can't access channel details",
                message:"Channel not accesible",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        const messages = await getPaginatedMessagesService({channelId},1,20,memberId)

        // console.log("channel:",channel)
        // console.log("messages:",messages)

        return {
            messages,
            _id:channel._id,
            name:channel.name,
            createdAt:channel.createdAt,
            updatedAt:channel.updatedAt,
            workspaceId:channel.workspaceId
        };

    } catch (error) {
        console.log("error in getChannelByService:",error);
        throw error;
    }
}