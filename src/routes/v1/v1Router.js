import express from "express";

import userRoutes from './userRoutes.js';
import { validate } from "../../validators/zodValidator.js";
import { userSignUpSchema } from "../../validators/userSchema.js";

const router = express.Router();

router.use('/users',validate(userSignUpSchema),userRoutes)

export default router;