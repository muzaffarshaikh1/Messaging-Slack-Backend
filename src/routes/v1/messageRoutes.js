import express from 'express';
// middlwares
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getPaginatedMessagesController } from '../../controllers/messageController.js';

const router = express.Router();


router.get('messages/:channelId', isAuthenticated, getPaginatedMessagesController);

export default router;