import express from "express";
import userRoutes from './userRoutes.js';
import workspaceRoutes from './workspaceRoutes.js'

const router = express.Router();

router.use('/users',userRoutes);
router.use('/workspaces',workspaceRoutes);


export default router;