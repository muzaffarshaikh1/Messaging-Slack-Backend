import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";
import { signUpService } from "../services/userService.js";

export const signUp = async (req, res) => {
    try {
        const user = await signUpService(req.body);
        return res.status(StatusCodes.CREATED).json(successResponse(user, "User Created Successfully!"))

    } catch (error) {
        console.log("error in signUp controller:", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}