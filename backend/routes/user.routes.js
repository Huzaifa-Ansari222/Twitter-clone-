import express from 'express';
import { protectRoute } from '../middeleware/protectRoute.js';
import { getUserProfile } from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/profile/:username',protectRoute,getUserProfile)

// router.get('/suggested',protectRoute,getUserProfile)
router.post('/follow/:id',protectRoute,followUnfollowUser)
// router.get('/update',protectRoute,updateUserProfile)


export default router;