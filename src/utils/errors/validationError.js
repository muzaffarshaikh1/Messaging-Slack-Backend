import { StatusCodes } from "http-status-codes";

class ValidationError extends Error {
    constructor(errorDetails, message = "Validation Error") {
        super(message);
        this.name = "ValidationError";
        this.statusCode = StatusCodes.BAD_REQUEST;

        const err = errorDetails.error;

        if (Array.isArray(err)) {
            this.explanation = err;
        } else if (typeof err === "object") {
            this.explanation = Object.values(err).map(e => e.message || e);
        } else {
            this.explanation = [String(err)];
        }
    }
}

export default ValidationError;
