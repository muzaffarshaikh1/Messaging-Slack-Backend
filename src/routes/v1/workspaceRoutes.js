import express from 'express';
import {
    createWorkspaceController,
    deleteWorkspaceController,
     getAllWorkspaceUserIsMemberOfController,
      getWorkspaceController,
      getWorkspaceByJoincodeController,
      updateWorkspaceController,
      addMemberToWorkspaceController,
      addChannelToWorkspaceController
} from '../../controllers/workspaceController.js';
import { validate } from '../../validators/zodValidator.js';
import { createWorkspaceSchema,addMemberToWorkspaceSchema,addChannelToWorkspaceSchema } from '../../validators/workspaceSchema.js';

// middlwares
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkspaceSchema), createWorkspaceController);
router.get('/', isAuthenticated, getAllWorkspaceUserIsMemberOfController);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController);
router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);
router.get('/join/:joincode', isAuthenticated, getWorkspaceByJoincodeController);
router.post('/:workspaceId/members',validate(addMemberToWorkspaceSchema), isAuthenticated, addMemberToWorkspaceController);
router.post('/:workspaceId/channels',validate(addChannelToWorkspaceSchema), isAuthenticated, addChannelToWorkspaceController);

export default router;