import ValidationError from "../utils/errors/validationError.js";
import userRepository from "../repositories/userRepository.js";

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

        throw error; // unknown errors
    }
};
