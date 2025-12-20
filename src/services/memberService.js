import workspaceRepository from "../repositories/workspaceRepository.js"
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const isMemberPartOfWorkspaceService = async (workspaceId,memberId)=>{
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

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
                explanation:"User is not member of workspace",
                message:"User is not member of workspace",
                statusCode:StatusCodes.UNAUTHORIZED
            });
        }
    
        const userDetails = userRepository.getById(memberId);

        return userDetails;
    } catch (error) {
        
    }    
}