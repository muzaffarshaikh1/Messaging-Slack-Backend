import { StatusCodes } from "http-status-codes";
import { getPaginatedMessagesRepository, getPaginatedMessagesService } from "../services/messageService"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject";

export const getPaginatedMessagesController = async (req,res) =>{
    try {
        const response = await getPaginatedMessagesService(
            {
                channelId:req.params.channelId,
            },
            req.query.page || 1,
            req.query.limit || 20,
            req.user
            );
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Messages fetched successfully!"));
        }
    } catch (error) {
        console.log("Error in getPaginatedMessagesController ", error);
        if (error.statusCode) {
            return res.status(error.StatusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}