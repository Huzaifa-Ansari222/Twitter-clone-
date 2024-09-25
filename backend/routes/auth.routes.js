import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middeleware/protectRoute.js';

const router = express.Router();

router.get('/me',protectRoute, getMe);//protectROute is middleware
router.post('/signup', signup);//('/route', controllers)
router.post('/login', login);
router.post('/logout', logout);


export default router;

//1 3 35