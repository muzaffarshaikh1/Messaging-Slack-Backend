import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse } from "../utils/common/responseObject.js";
import { verifyJWT } from "../utils/common/authUtils.js"
import userRepository from '../repositories/userRepository.js'


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: 'invalid data sent from the client',
                message: 'no auth token provided'
            }));
        }

        const response = verifyJWT(token);

        if (!response) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: 'invalid data sent from the client',
                message: 'invalid auth token provided'
            }))
        }

        const user = await userRepository.getById(response.id);
        res.user = user.id;
        next();

    } catch (error) {
        console.log("error in authMiddleware", error);
        if (error.name == 'JsonWebTokenError') {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: 'invalid data sent from the client',
                message: 'invalid auth token provided'
            })
            );
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
} 