import ValidationError from "../utils/errors/validationError.js";
import ClientError from '../utils/errors/clientError.js'
import userRepository from "../repositories/userRepository.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import { createJWT } from "../utils/common/authUtils.js";

export const signUpService = async (data) => {
    try {
        console.log("signUpService:", data);
        const newUser = await userRepository.create(data);
        return newUser;
    } catch (error) {
        console.log("error in userService: ", error);

        const duplicateError = error?.cause?.code === 11000;

        if (duplicateError) {
            throw new ValidationError(
                { error: ["A user with the same email or username already exists!"] },
                "Duplicate user entry"
            );
        }

        if (error.name === "ValidationError") {
            throw new ValidationError(
                { error: error.errors },
                error.message
            );
        }

        throw error;
    }
};

export const signInService = async (data) => {
    try {
        const user = await userRepository.getByEmail(data.email);
        if (!user) {
            throw new ClientError({
                explanation: "Inavalid data sent from the client",
                message: "no registered user Found with this email",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMatch = bcrypt.compareSync(data.password, user.password);

        if (!isMatch) {
            throw new ClientError({
                explanation: "Inavalid data sent from the client",
                message: "no registered user Found with this email",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        return {
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            token: createJWT({ id: user.id, email: user.email })
        }
    } catch (error) {
        console.log("error in signin service:",error);
        throw error;
    }
}