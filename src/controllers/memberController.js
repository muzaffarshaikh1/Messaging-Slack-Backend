import { StatusCodes } from "http-status-codes";
import { isMemberPartOfWorkspaceService } from "../services/memberService.js"
import { successResponse } from "../utils/common/responseObject.js";

export const isMemberPartOfWorkspaceController = async(req,res) =>{
    try {
        const response = isMemberPartOfWorkspaceService(req.params.workspaceId, req.user);
        if(response){
            return res.status(StatusCodes).json(successResponse(response,'User is member of workspace'));
        }
    } catch (error) {
        console.log("Error in isMemberPartOfWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));     
    }
}