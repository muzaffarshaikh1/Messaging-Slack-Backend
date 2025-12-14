import workspaceRepository from "../repositories/workspaceRepository.js";
import { v4 as uuidv4 } from 'uuid';
import ValidationError from "../utils/errors/validationError.js";

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