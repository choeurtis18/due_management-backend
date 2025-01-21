import express from 'express';
import { getProfile } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

// Route protégée pour récupérer le profil
router.get('/profile', authenticateToken, getProfile);

export default router;
