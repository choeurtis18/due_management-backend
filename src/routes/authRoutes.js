import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Inscription d'un utilisateur
router.post('/register', register);

// Connexion d'un utilisateur
router.post('/login', login);

export default router;
