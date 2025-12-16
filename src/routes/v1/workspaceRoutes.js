import express from 'express';
import { createWorkspaceController, deleteWorkspaceController, getAllWorkspaceUserIsMemberOfController, getWorkspaceController } from '../../controllers/workspaceController.js';
import { validate } from '../../validators/zodValidator.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';

// middlwares
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',isAuthenticated,validate(createWorkspaceSchema),createWorkspaceController)
router.get('/',isAuthenticated,getAllWorkspaceUserIsMemberOfController)
router.delete('/:workspaceId',isAuthenticated,deleteWorkspaceController)
router.get('/:workspaceId',isAuthenticated,getWorkspaceController)

export default router;