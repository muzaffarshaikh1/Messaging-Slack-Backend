import workspaceRepository from "../repositories/workspaceRepository.js";
import { v4 as uuidv4 } from 'uuid';
import ValidationError from "../utils/errors/validationError.js";
import channelRepository from "../repositories/channelRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/userRepository.js";
import { addEmailToMailQueue } from "../producers/mailQueueProducer.js";
import { workspaceJoinMail } from "../utils/common/mailObject.js";
export const isUserAdminOfWorkspace = (workspace, userId) => {
    return workspace.members.some(
        member => (member.memberId.toString() == userId 
        || member.memberId._id.toString() == userId)
         && member.role == 'admin'
    );
}

export const isUserMemberOfWorkspace = (workspace, userId) => {
    // console.log("-------------",workspace, userId);
    // console.log("********",workspace.members[0].memberId, userId, workspace.members[0].memberId == userId);


    return workspace.members.some(
        (member => member.memberId.toString() == userId 
        || member.memberId._id.toString() == userId)
    );
}

export const isAlreadyPartOfWorkspace = (workspace,channelName) => {
    return workspace.channels.find(channel => channel.name == channelName);
}

export const createWorkspaceService = async(workspaceData) => {
    try {
        const joinCode = uuidv4().substring(0,6).toUpperCase(); 

        const response = await workspaceRepository.create({
            name:workspaceData.name,
            description:workspaceData.description,
            joinCode
        });

        await workspaceRepository.addMemberToWorkspace(response.id,workspaceData.owner,'admin');

        const updatedresponse = await workspaceRepository.addChannelToWorkspace(response.id, 'general');

        return updatedresponse;
    } catch (error) {
        console.log("error in createWorkspaceService:",error);
        if(error.name =='ValidationError'){
            throw new ValidationError(
               {
                error:error.errors
               },
               error.message
            );
        }
        if(error.code == 11000){
            throw new ValidationError(
                {
                    error:['A workspace with same details already exits!'],  
                },
                'A workspace with same details already exits!'
            );
        }
        throw error;
    }
}

export const getAllWorkspaceUserIsMemberOfService = async(userId) => {
    try {
        const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
        return response;
    } catch (error) {
        console.log("error in getAllWorkspaceUserIsMemberOfService:",error);
        throw error;
    }
}

export const deleteWorkspaceService = async(workspaceId,userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        
        // console.log("workspace:",workspace);
        if(!workspace){
            throw new ClientError({
                explanation:"Inavalid data sent from the client",
                message:"workspace not found",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        // console.log("workspace.members: ",workspace.members,"userId:", userId)

        const isAllowed = isUserAdminOfWorkspace(workspace,userId);

        if(isAllowed){
            await channelRepository.deleteMany(workspace.channels);
            const response = await workspaceRepository.delete(workspaceId);
            return response;
        }
        throw new ClientError({
            explanation:"User is either not member or an admin of workspace",
            message:"user is not allowed to delete the workspace",
            statusCode:StatusCodes.UNAUTHORIZED
        });
    } catch (error) {
        console.log("error in deleteWorkspaceService:",error);
        throw error;
    }
}

export const getWorkspaceService = async (workspaceId, userId) => {
   try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if(!workspace){
        throw new ClientError({
            explanation:"Invalid data sent from the client",
            message:"Workspace not found",
            statusCode:StatusCodes.NOT_FOUND
        });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if(!isMember){
        throw new ClientError({
            explanation:"User is not member of workspace",
            message:"User is not member of workspace",
            statusCode:StatusCodes.UNAUTHORIZED
        });
    }

    return workspace;
   } catch (error) {
    console.log("error in getWorkspaceService: ",error);
    throw error;
   }
}


export const getWorkspaceByJoincodeService = async (joincode, userId) => {
    try {
     const workspace = await workspaceRepository.getWorkspaceByJoincode(joincode);
 
     if(!workspace){
         throw new ClientError({
             explanation:"Invalid data sent from the client",
             message:"Workspace not found",
             statusCode:StatusCodes.NOT_FOUND
         });
     }
 
     const isMember = isUserMemberOfWorkspace(workspace, userId);
 
     if(!isMember){
         throw new ClientError({
             explanation:"User is not member of workspace",
             message:"User is not member of workspace",
             statusCode:StatusCodes.UNAUTHORIZED
         });
     }
 
     return workspace;
    } catch (error) {
     console.log("error in getWorkspaceByJoincodeService: ",error);
     throw error;
    }
 }
 
 export const updateWorkspaceService = async (workspaceId,workspaceData, userId) =>{
   try {
    const workspace = await workspaceRepository.getById(workspaceId);
 
    if(!workspace){
        throw new ClientError({
            explanation:"Invalid data sent from the client",
            message:"Workspace not found",
            statusCode:StatusCodes.NOT_FOUND
        });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);

    if(!isAdmin){
        throw new ClientError({
            explanation:"User is not Admin of workspace",
            message:"User is not Admin of workspace",
            statusCode:StatusCodes.UNAUTHORIZED
        });
    }

    const updatedWorkspace = await workspaceRepository.update(workspaceId,workspaceData);

    return updatedWorkspace;
   } catch (error) {
    console.log("error in updateWorkspaceService: ",error);
    throw error;
   }
 }

 export const addMemberToWorkspaceService = async (workspaceId,memberId, role,userId) =>{
    try {
     const workspace = await workspaceRepository.getWorkspaceDetails(workspaceId);

     console.log("addMemberToWorkspaceService: ", workspace);
  
     if(!workspace){
         throw new ClientError({
             explanation:"Invalid data sent from the client",
             message:"Workspace not found",
             statusCode:StatusCodes.NOT_FOUND
         });
     }

    // is valid admin user
    const isValidUser1 = await userRepository.getById(userId);

    if (!isValidUser1) {
         throw new ClientError({
             explanation: 'Invalid data sent from the client',
             message: 'User not found',
             statusCode: StatusCodes.NOT_FOUND
         });
    }

    // is admin
    const isAdmin = isUserAdminOfWorkspace(workspace,userId);

    if(!isAdmin){
        throw new ClientError({
            explanation:"User is not Admin of workspace",
            message:"User is not Admin of workspace",
            statusCode:StatusCodes.UNAUTHORIZED
        });
    }

    //  valid member
     const isValidUser2 = await userRepository.getById(memberId);

     if (!isValidUser2) {
         throw new ClientError({
             explanation: 'Invalid data sent from the client',
             message: 'User not found',
             statusCode: StatusCodes.NOT_FOUND
         });
     }

    //  is already member
    const isMember = isUserMemberOfWorkspace(workspace, memberId);
 
    if(isMember){
         throw new ClientError({
             explanation:"User is already member of workspace",
             message:"User is already member of workspace",
             statusCode:StatusCodes.UNAUTHORIZED
         });
     }
 
     const response = workspaceRepository.addMemberToWorkspace(workspaceId,memberId,role);

     addEmailToMailQueue({
        ...workspaceJoinMail(workspace),
        to:isValidUser2.email,
     });

     return response;
 
    } catch (error) {
     console.log("error in addMemberToWorkspaceService: ",error);
     throw error;
    }
  }

  
 export const addChannelToWorkspaceService = async (workspaceId,channelName, userId) =>{
    console.log(workspaceId,channelName, userId)
    try {
     const workspace = await workspaceRepository.getById(workspaceId);
  
     if(!workspace){
         throw new ClientError({
             explanation:"Invalid data sent from the client",
             message:"Workspace not found",
             statusCode:StatusCodes.NOT_FOUND
         });
     }

     
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);

    if(!isAdmin){
        throw new ClientError({
            explanation:"User is not Admin of workspace",
            message:"User is not Admin of workspace",
            statusCode:StatusCodes.UNAUTHORIZED
        });
    }

     const isAlreadyPartOf = isAlreadyPartOfWorkspace(workspace,channelName);

     if(isAlreadyPartOf){
        throw new ClientError({
            explanation:"Invalid data sent from the client",
            message:"Channel is already part of workspace",
            statusCode:StatusCodes.UNAUTHORIZED
        });
    }
 
     const response = workspaceRepository.addChannelToWorkspace(workspaceId,channelName);

     return response;
 
    } catch (error) {
     console.log("error in addChannelToWorkspaceService: ",error);
     throw error;
    }
  }