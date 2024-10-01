import express from 'express';
import { protectRoute } from '../middeleware/protectRoute';
import { deleteNotifications, getNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications);


export default router;