import ValidationError from "../utils/errors/validationError.js";
import ClientError from '../utils/errors/clientError.js'
import userRepository from "../repositories/userRepository.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import { createJWT } from "../utils/common/authUtils.js";
import { ENABLE_EMAIL_VERIFICATION } from "../config/serverConfig.js";
import { addEmailToMailQueue } from "../producers/mailQueueProducer.js";
import { verifyEmailMail } from "../utils/common/mailObject.js";

export const signUpService = async (data) => {
    try {
        const newUser = await userRepository.signUpUser(data);
        if (ENABLE_EMAIL_VERIFICATION == true) {
            addEmailToMailQueue({
                    ...verifyEmailMail(newUser.verificationToken),
                    to: newUser.email
                });
        }
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

export const verifyTokenService = async (token) =>{
    try {
        const user = await userRepository.getByToken(token);
        if(!user){
            throw new ClientError({
                explanation: "Inavalid data sent from the client",
                message: "Invalid token",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }
        // check if token has expired or not
        if(user.verificationTokenExpiry < Date.now()){
            throw new ClientError({
                explanation: "Inavalid data sent from the client",
                message: "Token has expired",
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        return user;
    } catch (error) {
        console.error('User Service error',error)
        throw error;
    }
}

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
            _id: user._id,
            token: createJWT({ id: user.id, email: user.email })
        }
    } catch (error) {
        console.log("error in signin service:", error);
        throw error;
    }
}