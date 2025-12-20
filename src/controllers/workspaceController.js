import { StatusCodes } from "http-status-codes";
import {
    addChannelToWorkspaceService,
    addMemberToWorkspaceService,
    createWorkspaceService,
    deleteWorkspaceService,
    getAllWorkspaceUserIsMemberOfService,
    getWorkspaceByJoincodeService,
    getWorkspaceService,
    updateWorkspaceService
} from "../services/workspaceService.js"
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
        console.log("req.user: ", req.user);
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
        const response = await deleteWorkspaceService(req.params.workspaceId, req.user);
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
        const response = await getWorkspaceService(req.params.workspaceId, req.user);
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Workspace fetched successfully!"));
        }
    } catch (error) {
        console.log("Error in getWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getWorkspaceByJoincodeController = async (req, res) => {
    try {
        const response = await getWorkspaceByJoincodeService(req.params.joincode, req.user);
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Workspace fetched successfully!"));
        }
    } catch (error) {
        console.log("Error in getWorkspaceByJoincodeController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const updateWorkspaceController = async (req, res) => {
    try {
        const response = await updateWorkspaceService(req.params.workspaceId,req.body,req.user)
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Workspace Updated successfully!"));
        }
    } catch (error) {
        console.log("Error in updateWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const addMemberToWorkspaceController = async (req, res) => {
    try {
        const response = await addMemberToWorkspaceService(req.params.workspaceId,req.body.memberId,req.body.role ||'member',req.user)
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Member added to Workspace successfully!"));
        }

    } catch (error) {
        console.log("Error in addMemberToWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const addChannelToWorkspaceController = async (req, res) => {
    try {
        const response = await addChannelToWorkspaceService(req.params.workspaceId,req.body.channelName,req.user)
        if (response) {
            return res.status(StatusCodes.OK).json(successResponse(response, "Channel added to Workspace successfully!"));
        }

    } catch (error) {
        console.log("Error in addChannelToWorkspaceController: ", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}