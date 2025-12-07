import express from "express";
import { StatusCodes } from "http-status-codes";
import { signIn, signUp } from "../../controllers/userController.js";
import { validate } from '../../validators/zodValidator.js'

import {userSignUpSchema,userSignInSchema} from '../../validators/userSchema.js'

const router = express.Router();

router.post('/signup',validate(userSignUpSchema),signUp)
router.post('/signin',validate(userSignInSchema),signIn)

export default router;