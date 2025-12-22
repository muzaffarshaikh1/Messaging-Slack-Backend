import { StatusCodes } from "http-status-codes";
import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js"
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getPaginatedMessagesService = async(messageParams,page,limit,memberId) =>{
    try {
        const channel = channelRepository.getChannelDetails(messageParams.channelId);

        if(!channel){
            throw new ClientError({
                explanation:"Invalid data sent from the client",
                message:"Channel not found",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        const workspace = await workspaceRepository.getById(channel.workspaceId);

        if(!workspace){
            throw new ClientError({
                explanation:"Invalid data sent from the client",
                message:"Workspace not found",
                statusCode:StatusCodes.NOT_FOUND
            });
        }
    
        const isMember = isUserMemberOfWorkspace(workspace, memberId);
    
        if(!isMember){
            throw new ClientError({
                explanation:"User is not member of workspace hence can't access channel messages",
                message:"Messages of this this channel can't accessable",
                statusCode:StatusCodes.UNAUTHORIZED
            });
        }

        const messages = await messageRepository.getPaginatedMessages(messageParams,page,limit);

        return messages
    } catch (error) {
        console.log("error in getPaginatedMessagesRepository",error);
        throw error;
    }
}

export const createMessageService = async(message) =>{
    const newMessage = await messageRepository.create(message);
    return newMessage;
}