import express from 'express';
import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { validate } from '../../validators/zodValidator.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';

// middlwares
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/create',isAuthenticated,validate(createWorkspaceSchema),createWorkspaceController)

export default router;