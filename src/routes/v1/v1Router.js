import express from "express";
import userRoutes from './userRoutes.js';
import channelRoutes from './channelRoutes.js'
import workspaceRoutes from './workspaceRoutes.js'
import memberRouter from './memberRoutes.js'

const router = express.Router();

router.use('/users',userRoutes);
router.use('/workspaces',workspaceRoutes);
router.use('/channels',channelRoutes);
router.use('/members',memberRouter);


export default router;