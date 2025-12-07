import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";
import { signInService, signUpService } from "../services/userService.js";

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

export const signIn = async (req,res) =>{
    try {
        const response = await signInService(req.body);
        return res.status(StatusCodes.OK).json(successResponse(response,"User Logged In Successfully!"));
    } catch (error) {
        console.log("error in signIn controller",error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}