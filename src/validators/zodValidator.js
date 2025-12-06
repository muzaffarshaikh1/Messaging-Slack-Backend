// import { StatusCodes } from "http-status-codes";
// import { customErrorResponse } from "../utils/common/responseObject.js";
// import { ZodError } from "zod";

// export const validate = (schema) => {
//     return async (req, res, next) => {
//         try {
//             await schema.parseAsync(req.body);
//             next();
//         } catch (error) {
//             console.log("RAW ERROR:", error.issues, typeof error.issues);

//             let explanation = [];
//             let errorMessage = '';
//             error.issues.forEach(key => {
//                 explanation.push(key.path[0] + ' ' + key.message);
//                 errorMessage += ' : '+ key.path[0] + ' ' + key.message;
//             });

//             res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
//                 message: 'Validation Error'  + errorMessage,
//                 explanation: explanation
//             })
//             );
//         }
//     }
// }

import { StatusCodes } from "http-status-codes";
import { customErrorResponse } from "../utils/common/responseObject.js";
import { ZodError } from "zod";

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                
                let explanation = [];
                let errorMessage = '';
                
                error.issues.forEach((issue) => {
                    const field = issue.path[0];
                    let message = issue.message;
                    
                    if (message.includes('expected string, received undefined')) {
                        message = 'is required';
                    } else if (message.includes('Invalid input')) {
                        message = 'is required';
                    } else if (message.includes('Invalid email')) {
                        message = 'must be a valid email';
                    } else if (message.includes('Too small')) {
                        const match = message.match(/>=(\d+)/);
                        if (match) {
                            message = `must be at least ${match[1]} characters`;
                        }
                    } else if (message.includes('Too big')) {
                        const match = message.match(/<=(\d+)/);
                        if (match) {
                            message = `must be at most ${match[1]} characters`;
                        }
                    }
                    
                    explanation.push(`${field} ${message}`);
                    errorMessage += errorMessage ? `, ${field} ${message}` : `${field} ${message}`;
                });
                
                return res.status(StatusCodes.BAD_REQUEST).json(
                    customErrorResponse({
                        message: `Validation failed: ${errorMessage}`,
                        explanation: explanation
                    })
                );
            }
            
            console.error("Unexpected error:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                customErrorResponse({
                    message: 'Internal server error',
                    explanation: ['An unexpected error occurred']
                })
            );
        }
    }
}