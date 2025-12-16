import { StatusCodes } from "http-status-codes";
import { createWorkspaceService, deleteWorkspaceService, getAllWorkspaceUserIsMemberOfService, getWorkspaceService } from "../services/workspaceService.js"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";

export const createWorkspaceController = async (req, res) => {
    try {
        const response = await createWorkspaceService({ ...req.body, owner: req.user });
        if (response) {
            return res.status(StatusCodes.CREATED).json(successResponse(response, "Workspace created successfully!"));
        }
    } catch (error) {
        console.log("Error in Create Workspace controller", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getAllWorkspaceUserIsMemberOfController = async (req, res) => {
    try {
        console.log("req.user: ",req.user);
        // return res.json("ok")
        const response = await getAllWorkspaceUserIsMemberOfService(req.user);
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "All Workspaces fetched successfully!"));
        }
    } catch (error) {
        console.log("Error in getAllWorkspaceUserIsMemberOfController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}


export const deleteWorkspaceController = async (req, res) => {
    try {
        const response = await deleteWorkspaceService(req.params.workspaceId,req.user);
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Workspaces deleted successfully!"));
        }
    } catch (error) {
        console.log("Error in deleteWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getWorkspaceController = async (req, res) => {
    try {
        const response = await getWorkspaceService(req.params.workspaceId,req.user);
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Workspaces fetched successfully!"));
        }
    } catch (error) {
        console.log("Error in getWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}
