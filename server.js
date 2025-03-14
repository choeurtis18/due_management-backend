import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
dotenv.config();

// Définir les chemins du fichier et du dossier courant (pour ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Configuration de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Autorise le frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middleware pour parser les requêtes JSON
app.use(express.json());

// ✅ Servir les fichiers statiques du frontend React
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Définition des routes API
import duesRoutes from './src/routes/dues.js';
import membersRoutes from './src/routes/members.js';
import categoriesRoutes from './src/routes/categories.js';
import monthsRoutes from './src/routes/months.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

app.use('/api/dues', duesRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/months', monthsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ✅ Gestion des erreurs globales
import errorHandler from './src/middlewares/errorHandler.js';
app.use(errorHandler);

// ✅ Route pour servir le frontend React (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Définition du port
const PORT = process.env.PORT || 4000;

// ✅ Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});